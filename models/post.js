const { DataTypes } = require('sequelize');

module.exports = (sequelize, User) => {
    const Post = sequelize.define('Post', {
        content: { type: DataTypes.TEXT, allowNull: false },
        mediaUrl: { type: DataTypes.STRING },
    });
    
    // Теперь модель User передается как параметр и будет правильно использована
    Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

    return Post;
};
