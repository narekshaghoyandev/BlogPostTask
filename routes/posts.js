const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { Post } = require('../models');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API для управления постами
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Получить список всех постов
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Список постов успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   mediaUrl:
 *                     type: string
 *                   authorId:
 *                     type: integer
 */
router.get('/', async (req, res) => {
    const posts = await Post.findAll({ include: 'author' });
    res.json(posts);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Создать новый пост
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пост успешно создан
 *       401:
 *         description: Не авторизован
 */
router.post('/', authenticate, async (req, res) => {
    const { content, mediaUrl } = req.body;
    const post = await Post.create({ content, mediaUrl, authorId: req.user.id });
    res.json(post);
});

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Обновить пост
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID поста
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пост успешно обновлен
 *       404:
 *         description: Пост не найден
 */
router.patch('/:id', authenticate, async (req, res) => {
    const post = await Post.findOne({
        where: {
            id: req.params.id,
            authorId: req.user.id
        }
    });

    if (!post) return res.status(404).json({ message: 'Пост не найден' });
    post.update(req.body);
    res.json(post);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Удалить пост
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID поста
 *     responses:
 *       204:
 *         description: Пост успешно удален
 *       404:
 *         description: Пост не найден
 */
router.delete('/:id', authenticate, async (req, res) => {
    const post = await Post.findOne({
        where: {
            id: req.params.id,
            authorId: req.user.id
        }
    });
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    await post.destroy();
    res.status(204).send();
});

module.exports = router;
