const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    // Destructure query parameters
    const {
      page = 1,
      limit = 10,
      genre,
      sortBy = 'createdAt',
      order = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (genre) filter.genre = genre;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const books = await Book.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Public
const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update book
// @route   PUT /api/v1/books/:id
// @access  Public
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// @access  Public
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get books by genre
// @route   GET /api/v1/books/genre/:genre
// @access  Public
const getBooksByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const books = await Book.find({ genre })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Book.countDocuments({ genre });

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available books (in stock)
// @route   GET /api/v1/books/available
// @access  Public
const getAvailableBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const books = await Book.find({ inStock: true, stockQuantity: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Book.countDocuments({ inStock: true, stockQuantity: { $gt: 0 } });

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: books
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBooksByGenre,
  getAvailableBooks
};