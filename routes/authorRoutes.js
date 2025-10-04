const express = require('express');
const router = express.Router();

// Import controller methods
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getActiveAuthors,
  getAuthorsByNationality
} = require('../controllers/authorController');

// Import validation middleware
const {
  authorValidationRules,
  updateAuthorValidationRules,
  authorSearchValidation
} = require('../middleware/authorValidation');

const { validateObjectId } = require('../middleware/bookValidation');
const { handleValidationErrors } = require('../middleware/errorHandler');

// GET /api/v1/authors/active - Get active authors (must be before /:id)
router.get('/active', authorSearchValidation(), handleValidationErrors, getActiveAuthors);

// GET /api/v1/authors/nationality/:nationality - Get authors by nationality (must be before /:id)
router.get('/nationality/:nationality', authorSearchValidation(), handleValidationErrors, getAuthorsByNationality);

// GET /api/v1/authors - Get all authors with filtering, search, and pagination
router.get('/', authorSearchValidation(), handleValidationErrors, getAuthors);

// POST /api/v1/authors - Create a new author
router.post('/', authorValidationRules(), handleValidationErrors, createAuthor);

// GET /api/v1/authors/:id - Get single author by ID
router.get('/:id', validateObjectId(), handleValidationErrors, getAuthor);

// PUT /api/v1/authors/:id - Update author by ID
router.put('/:id', [
  validateObjectId(),
  updateAuthorValidationRules()
], handleValidationErrors, updateAuthor);

// DELETE /api/v1/authors/:id - Delete author by ID
router.delete('/:id', validateObjectId(), handleValidationErrors, deleteAuthor);

module.exports = router;