const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Book validation rules
const bookValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    
    body('isbn')
      .trim()
      .notEmpty()
      .withMessage('ISBN is required')
      .matches(/^(?:ISBN(?:-1[03])?:?\s*)?(?:97[89][\d\s\-]{1,}[\dX]|[\d\s\-]{9,}[\dX])$/)
      .withMessage('Please enter a valid ISBN'),
    
    body('genre')
      .notEmpty()
      .withMessage('Genre is required')
      .isIn(['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Other'])
      .withMessage('Invalid genre'),
    
    body('publishedDate')
      .notEmpty()
      .withMessage('Published date is required')
      .isISO8601()
      .withMessage('Published date must be a valid date')
      .custom((value) => {
        if (new Date(value) > new Date()) {
          throw new Error('Published date cannot be in the future');
        }
        return true;
      }),
    
    body('pages')
      .notEmpty()
      .withMessage('Number of pages is required')
      .isInt({ min: 1, max: 10000 })
      .withMessage('Pages must be between 1 and 10000'),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('publisher')
      .trim()
      .notEmpty()
      .withMessage('Publisher is required')
      .isLength({ max: 100 })
      .withMessage('Publisher name cannot exceed 100 characters'),
    
    body('language')
      .trim()
      .notEmpty()
      .withMessage('Language is required'),
    
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('stockQuantity')
      .notEmpty()
      .withMessage('Stock quantity is required')
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a non-negative integer'),
    
    body('inStock')
      .optional()
      .isBoolean()
      .withMessage('inStock must be a boolean value')
  ];
};

// Update book validation (all fields optional)
const updateBookValidationRules = () => {
  return [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
      
    body('author')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
      
    body('isbn')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('ISBN cannot be empty')
      .matches(/^(?:ISBN(?:-1[03])?:? )?(?=[X\d ]{9,17}$|97[89][X\d ]{10,16}$)[\d -]{9,16}[X\d]$/)
      .withMessage('Please enter a valid ISBN'),
      
    body('genre')
      .optional()
      .isIn(['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Other'])
      .withMessage('Invalid genre'),
      
    body('publishedDate')
      .optional()
      .isISO8601()
      .withMessage('Published date must be a valid date')
      .custom((value) => {
        if (new Date(value) > new Date()) {
          throw new Error('Published date cannot be in the future');
        }
        return true;
      }),
      
    body('pages')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Pages must be between 1 and 10000'),
      
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
      
    body('publisher')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Publisher cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Publisher name cannot exceed 100 characters'),
      
    body('language')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Language cannot be empty'),
      
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
      
    body('stockQuantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock quantity must be a non-negative integer'),
      
    body('inStock')
      .optional()
      .isBoolean()
      .withMessage('inStock must be a boolean value')
  ];
};

// MongoDB ObjectId validation
const validateObjectId = () => {
  return [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format')
  ];
};

// Query parameter validation for book search
const bookSearchValidation = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
      
    query('genre')
      .optional()
      .isIn(['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Other'])
      .withMessage('Invalid genre'),
      
    query('sortBy')
      .optional()
      .isIn(['title', 'author', 'publishedDate', 'price', 'createdAt'])
      .withMessage('Invalid sort field'),
      
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc')
  ];
};

module.exports = {
  validateBook: [bookValidationRules(), handleValidationErrors],
  validateBookUpdate: [updateBookValidationRules(), handleValidationErrors],
  validateObjectId,
  bookSearchValidation,
  handleValidationErrors
};