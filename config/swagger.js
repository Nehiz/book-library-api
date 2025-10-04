const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Library API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for managing books and authors with full CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@booklibrary.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://your-render-app.onrender.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'genre', 'publishedDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB generated ID'
            },
            title: {
              type: 'string',
              description: 'Book title',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Author ID reference',
              example: '507f1f77bcf86cd799439011'
            },
            isbn: {
              type: 'string',
              description: 'International Standard Book Number',
              example: '978-0-7432-7356-5'
            },
            genre: {
              type: 'string',
              description: 'Book genre',
              example: 'Fiction'
            },
            publishedDate: {
              type: 'string',
              format: 'date',
              description: 'Publication date',
              example: '1925-04-10'
            },
            pages: {
              type: 'number',
              description: 'Number of pages',
              example: 180
            },
            description: {
              type: 'string',
              description: 'Book description',
              example: 'A classic American novel set in the Jazz Age'
            },
            language: {
              type: 'string',
              description: 'Book language',
              example: 'English'
            },
            publisher: {
              type: 'string',
              description: 'Publisher name',
              example: 'Scribner'
            },
            price: {
              type: 'number',
              description: 'Book price',
              example: 12.99
            },
            inStock: {
              type: 'boolean',
              description: 'Availability status',
              example: true
            }
          }
        },
        Author: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB generated ID'
            },
            firstName: {
              type: 'string',
              description: 'Author first name',
              example: 'F. Scott'
            },
            lastName: {
              type: 'string',
              description: 'Author last name',
              example: 'Fitzgerald'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Author email address',
              example: 'fscott@example.com'
            },
            biography: {
              type: 'string',
              description: 'Author biography',
              example: 'American novelist and short story writer'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Author birth date',
              example: '1896-09-24'
            },
            nationality: {
              type: 'string',
              description: 'Author nationality',
              example: 'American'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Author website',
              example: 'https://fscottfitzgerald.com'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            },
            message: {
              type: 'string',
              example: 'Detailed error description'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Book Library API Documentation'
  }));
  
  // Swagger JSON endpoint
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = setupSwagger;