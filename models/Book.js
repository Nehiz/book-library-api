const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Basic ISBN validation (10 or 13 digits with optional hyphens)
        return /^(?:ISBN(?:-1[03])?:? )?(?=[X\d ]{9,17}$|97[89][X\d ]{10,16}$)[\d -]{9,16}[X\d]$/.test(v);
      },
      message: 'Please enter a valid ISBN'
    }
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Technology', 'Other'],
    default: 'Other'
  },
  publishedDate: {
    type: Date,
    required: [true, 'Published date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Published date cannot be in the future'
    }
  },
  pages: {
    type: Number,
    required: [true, 'Number of pages is required'],
    min: [1, 'Pages must be at least 1'],
    max: [10000, 'Pages cannot exceed 10000']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    default: 'English',
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    set: v => Math.round(v * 100) / 100 // Round to 2 decimal places
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ publishedDate: -1 });

// Virtual for book availability
bookSchema.virtual('isAvailable').get(function() {
  return this.inStock && this.stockQuantity > 0;
});

// Pre-save middleware to update inStock based on stockQuantity
bookSchema.pre('save', function(next) {
  this.inStock = this.stockQuantity > 0;
  next();
});

module.exports = mongoose.model('Book', bookSchema);