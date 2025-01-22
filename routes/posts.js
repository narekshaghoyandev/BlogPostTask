const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { Post } = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await Post.findAll({ include: 'author' });
    res.json(posts);
});

router.post('/', authenticate, async (req, res) => {
    const { content, mediaUrl } = req.body;
    const post = await Post.create({ content, mediaUrl, authorId: req.user.id });
    res.json(post);
});

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