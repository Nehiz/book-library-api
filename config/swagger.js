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
        url: 'https://book-library-api-pbo0.onrender.com'
      },
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer {token}'
        }
      },
      schemas: {
        BookInput: {
          type: 'object',
          required: ['title', 'author', 'isbn', 'genre', 'publishedDate', 'pages', 'description'],
          properties: {
            title: {
              type: 'string',
              description: 'Book title',
              example: 'The Great Gatsby'
            },
            author: {
              type: 'string',
              description: 'Author name',
              example: 'F. Scott Fitzgerald'
            },
            isbn: {
              type: 'string',
              description: 'ISBN number',
              example: '978-0-7432-7356-5'
            },
            genre: {
              type: 'string',
              enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Other'],
              example: 'Fiction'
            },
            publishedDate: {
              type: 'string',
              format: 'date',
              description: 'Publication date',
              example: '1925-04-10'
            },
            pages: {
              type: 'integer',
              minimum: 1,
              maximum: 10000,
              description: 'Number of pages',
              example: 180
            },
            description: {
              type: 'string',
              description: 'Book description',
              example: 'A classic American novel set in the Jazz Age'
            },
            publisher: {
              type: 'string',
              description: 'Publisher name',
              example: 'Scribner'
            },
            language: {
              type: 'string',
              description: 'Book language',
              example: 'English'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Book price',
              example: 12.99
            },
            stockQuantity: {
              type: 'integer',
              minimum: 0,
              description: 'Stock quantity',
              example: 50
            },
            inStock: {
              type: 'boolean',
              description: 'Whether book is in stock',
              example: true
            }
          }
        },
        Book: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB generated ID'
            },
            title: {
              type: 'string',
              description: 'Book title'
            },
            author: {
              type: 'string',
              description: 'Author name'
            },
            isbn: {
              type: 'string',
              description: 'ISBN number'
            },
            genre: {
              type: 'string',
              description: 'Book genre'
            },
            publishedDate: {
              type: 'string',
              format: 'date',
              description: 'Publication date'
            },
            pages: {
              type: 'integer',
              description: 'Number of pages'
            },
            description: {
              type: 'string',
              description: 'Book description'
            },
            publisher: {
              type: 'string',
              description: 'Publisher name'
            },
            language: {
              type: 'string',
              description: 'Book language'
            },
            price: {
              type: 'number',
              description: 'Book price'
            },
            stockQuantity: {
              type: 'integer',
              description: 'Stock quantity'
            },
            inStock: {
              type: 'boolean',
              description: 'Whether book is in stock'
            },
            isAvailable: {
              type: 'boolean',
              description: 'Computed availability'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        AuthorInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: {
              type: 'string',
              description: 'Author first name',
              example: 'Gabriel'
            },
            lastName: {
              type: 'string',
              description: 'Author last name',
              example: 'García Márquez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Author email',
              example: 'gabriel.marquez@example.com'
            },
            biography: {
              type: 'string',
              description: 'Author biography',
              example: 'Colombian novelist and Nobel Prize winner'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Author birth date',
              example: '1927-03-06'
            },
            nationality: {
              type: 'string',
              description: 'Author nationality',
              example: 'Colombian'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Author website',
              example: 'https://example.com/author'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether author is active',
              example: true
            }
          }
        },
        Author: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB generated ID'
            },
            firstName: {
              type: 'string',
              description: 'Author first name'
            },
            lastName: {
              type: 'string',
              description: 'Author last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Author email'
            },
            biography: {
              type: 'string',
              description: 'Author biography'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Author birth date'
            },
            nationality: {
              type: 'string',
              description: 'Author nationality'
            },
            website: {
              type: 'string',
              format: 'uri',
              description: 'Author website'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether author is active'
            },
            fullName: {
              type: 'string',
              description: 'Computed full name'
            },
            age: {
              type: 'integer',
              description: 'Computed age'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;