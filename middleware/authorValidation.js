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

// Author validation rules
const authorValidationRules = () => {
  return [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
    
    body('biography')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Biography cannot exceed 2000 characters'),
    
    body('birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date')
      .custom((value) => {
        if (value && new Date(value) > new Date()) {
          throw new Error('Birth date cannot be in the future');
        }
        return true;
      }),
    
    body('nationality')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Nationality cannot exceed 50 characters'),
    
    body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Please enter a valid website URL'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ];
};

// Update author validation (all fields optional)
const updateAuthorValidationRules = () => {
  return [
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty')
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
      
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Last name cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
      
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please enter a valid email address')
      .normalizeEmail(),
      
    body('biography')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Biography cannot exceed 2000 characters'),
      
    body('birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date')
      .custom((value) => {
        if (value && new Date(value) > new Date()) {
          throw new Error('Birth date cannot be in the future');
        }
        return true;
      }),
      
    body('nationality')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Nationality cannot exceed 50 characters'),
      
    body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Please enter a valid website URL'),
      
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value')
  ];
};

// Query parameter validation for authors
const authorSearchValidation = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
      
    query('nationality')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Nationality cannot be empty'),
      
    query('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
      
    query('sortBy')
      .optional()
      .isIn(['firstName', 'lastName', 'email', 'birthDate', 'nationality', 'createdAt'])
      .withMessage('Invalid sort field'),
      
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc')
  ];
};

// Emergency simplified validation
const validateAuthor = [
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Valid email required'),
  handleValidationErrors
];

const validateAuthorUpdate = [
  body('firstName').optional().notEmpty(),
  body('lastName').optional().notEmpty(),
  body('email').optional().isEmail(),
  handleValidationErrors
];

module.exports = {
  validateAuthor,
  validateAuthorUpdate,
  authorSearchValidation,
  handleValidationErrors
};