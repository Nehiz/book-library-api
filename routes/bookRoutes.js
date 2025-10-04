const express = require('express');
const router = express.Router();

// Import controller methods
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBooksByGenre,
  getAvailableBooks
} = require('../controllers/bookController');

// Import validation middleware
const {
  bookValidationRules,
  updateBookValidationRules,
  validateObjectId,
  bookSearchValidation
} = require('../middleware/bookValidation');

const { handleValidationErrors } = require('../middleware/errorHandler');

// GET /api/v1/books/available - Get available books (must be before /:id)
router.get('/available', bookSearchValidation(), handleValidationErrors, getAvailableBooks);

// GET /api/v1/books/genre/:genre - Get books by genre (must be before /:id)
router.get('/genre/:genre', bookSearchValidation(), handleValidationErrors, getBooksByGenre);

// GET /api/v1/books - Get all books with filtering, search, and pagination
router.get('/', bookSearchValidation(), handleValidationErrors, getBooks);

// POST /api/v1/books - Create a new book
router.post('/', bookValidationRules(), handleValidationErrors, createBook);

// GET /api/v1/books/:id - Get single book by ID
router.get('/:id', validateObjectId(), handleValidationErrors, getBook);

// PUT /api/v1/books/:id - Update book by ID
router.put('/:id', [
  validateObjectId(),
  updateBookValidationRules()
], handleValidationErrors, updateBook);

// DELETE /api/v1/books/:id - Delete book by ID
router.delete('/:id', validateObjectId(), handleValidationErrors, deleteBook);

module.exports = router;