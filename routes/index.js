const express = require('express');
const router = express.Router();

// Route for the base URL /
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Book Library API!',
    version: '1.0.0',
    endpoints: {
      books: '/api/v1/books',
      authors: '/api/v1/authors',
      documentation: '/api-docs'
    }
  });
});

// API v1 routes
router.use('/api/v1/books', require('./books'));
router.use('/api/v1/authors', require('./authors'));

module.exports = router;