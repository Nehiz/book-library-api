const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Library API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for managing books and authors with full CRUD operations.'
    },
    servers: [
      {
        url: 'https://book-library-api-pbo0.onrender.com/api/v1'
      },
      {
        url: 'http://localhost:3000/api/v1'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;