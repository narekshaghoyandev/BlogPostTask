const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Post = sequelize.define('Post', {
    content: { type: DataTypes.TEXT, allowNull: false },
    mediaUrl: { type: DataTypes.STRING },
});

Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
module.exports = Post;