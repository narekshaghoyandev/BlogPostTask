const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API Documentation',
            version: '1.0.0',
            description: 'Документация для вашего API',
        },
    },
    apis: ['./routes/*.js'], // Путь к вашим файлам маршрутов
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
