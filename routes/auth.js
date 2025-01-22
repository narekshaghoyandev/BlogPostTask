const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;

    // Проверка наличия данных
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = await User.create({ username, password: hashedPassword });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
