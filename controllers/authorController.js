const Author = require('../models/Author');

// @desc    Get all authors
// @route   GET /api/v1/authors
// @access  Public
const getAuthors = async (req, res, next) => {
  try {
    // Destructure query parameters
    const {
      page = 1,
      limit = 10,
      nationality,
      isActive,
      sortBy = 'createdAt',
      order = 'desc',
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (nationality) filter.nationality = nationality;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { biography: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query
    const authors = await Author.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Author.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: authors.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: authors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single author
// @route   GET /api/v1/authors/:id
// @access  Public
const getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new author
// @route   POST /api/v1/authors
// @access  Public
const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Author created successfully',
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update author
// @route   PUT /api/v1/authors/:id
// @access  Public
const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Author updated successfully',
      data: author
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete author
// @route   DELETE /api/v1/authors/:id
// @access  Public
const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Author deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active authors
// @route   GET /api/v1/authors/active
// @access  Public
const getActiveAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const authors = await Author.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Author.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      count: authors.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: authors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get authors by nationality
// @route   GET /api/v1/authors/nationality/:nationality
// @access  Public
const getAuthorsByNationality = async (req, res, next) => {
  try {
    const { nationality } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const authors = await Author.find({ nationality })
      .sort({ lastName: 1, firstName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Author.countDocuments({ nationality });

    res.status(200).json({
      success: true,
      count: authors.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: authors
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getActiveAuthors,
  getAuthorsByNationality
};