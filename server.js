require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');

const app = express();
app.use(express.json());
app.use(cors());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 8080;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
