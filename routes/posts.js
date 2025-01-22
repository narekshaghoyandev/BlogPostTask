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
    const post = await Post.findByPk(req.params.id);
    if (post.authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    post.update(req.body);
    res.json(post);
});

router.delete('/:id', authenticate, async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (post.authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await post.destroy();
    res.status(204).send();
});

module.exports = router;