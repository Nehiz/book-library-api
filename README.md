# Book Library API

A comprehensive RESTful API for managing a book library with full CRUD operations, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Complete CRUD Operations** for Books and Authors
- **Data Validation** with express-validator
- **Error Handling** with comprehensive error messages
- **Search & Filtering** capabilities
- **Pagination** support
- **MongoDB Integration** with Mongoose
- **RESTful API Design** following best practices

## 📋 Requirements Met

### Week 03 (Part 1) - CRUD Operations ✅
- ✅ Two collections (Books & Authors)
- ✅ Books collection has 12+ fields (title, author, isbn, genre, publishedDate, pages, description, publisher, language, price, inStock, stockQuantity)
- ✅ MongoDB connection with Mongoose
- ✅ Full CRUD operations (GET, POST, PUT, DELETE)
- ✅ Data validation and error handling
- ✅ Professional API structure

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd book-library-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` file and update with your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/booklibrary`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/booklibrary`

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   - Open http://localhost:3000 in your browser
   - You should see the API welcome message

## 📚 API Endpoints

### Books Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/books` | Get all books (with pagination, search, filtering) |
| GET | `/api/v1/books/:id` | Get single book by ID |
| POST | `/api/v1/books` | Create new book |
| PUT | `/api/v1/books/:id` | Update book by ID |
| DELETE | `/api/v1/books/:id` | Delete book by ID |
| GET | `/api/v1/books/available` | Get available books (in stock) |
| GET | `/api/v1/books/genre/:genre` | Get books by genre |

### Authors Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/authors` | Get all authors (with pagination, search, filtering) |
| GET | `/api/v1/authors/:id` | Get single author by ID |
| POST | `/api/v1/authors` | Create new author |
| PUT | `/api/v1/authors/:id` | Update author by ID |
| DELETE | `/api/v1/authors/:id` | Delete author by ID |
| GET | `/api/v1/authors/active` | Get active authors |
| GET | `/api/v1/authors/nationality/:nationality` | Get authors by nationality |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/api/v1/status` | API health check |

## 📖 API Usage Examples

### Create a Book
```bash
POST /api/v1/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "genre": "Fiction",
  "publishedDate": "1925-04-10",
  "pages": 180,
  "description": "A classic American novel set in the Jazz Age",
  "publisher": "Charles Scribner's Sons",
  "language": "English",
  "price": 12.99,
  "stockQuantity": 50
}
```

### Get Books with Filtering
```bash
GET /api/v1/books?genre=Fiction&page=1&limit=10&search=gatsby&sortBy=title&order=asc
```

### Create an Author
```bash
POST /api/v1/authors
Content-Type: application/json

{
  "firstName": "F. Scott",
  "lastName": "Fitzgerald",
  "email": "fscott@example.com",
  "biography": "American novelist and short story writer",
  "birthDate": "1896-09-24",
  "nationality": "American",
  "website": "https://fscottfitzgerald.com"
}
```

## 🗄️ Database Schema

### Books Collection
- **title** (String, required) - Book title
- **author** (String, required) - Author name
- **isbn** (String, required, unique) - ISBN number
- **genre** (String, required) - Book genre
- **publishedDate** (Date, required) - Publication date
- **pages** (Number, required) - Number of pages
- **description** (String, required) - Book description
- **publisher** (String, required) - Publisher name
- **language** (String, required) - Book language
- **price** (Number, required) - Book price
- **inStock** (Boolean) - Availability status
- **stockQuantity** (Number, required) - Stock quantity

### Authors Collection
- **firstName** (String, required) - First name
- **lastName** (String, required) - Last name
- **email** (String, required, unique) - Email address
- **biography** (String, optional) - Author biography
- **birthDate** (Date, optional) - Birth date
- **nationality** (String, optional) - Nationality
- **website** (String, optional) - Website URL
- **isActive** (Boolean) - Active status

## 🔧 Query Parameters

### Books
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `genre` - Filter by genre
- `search` - Search in title, author, description
- `sortBy` - Sort field (title, author, publishedDate, price, createdAt)
- `order` - Sort order (asc, desc)

### Authors
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `nationality` - Filter by nationality
- `isActive` - Filter by active status
- `search` - Search in name, email, biography
- `sortBy` - Sort field (firstName, lastName, email, birthDate, nationality, createdAt)
- `order` - Sort order (asc, desc)

## ✅ Validation Rules

### Book Validation
- Title: Required, max 200 characters
- Author: Required, max 100 characters
- ISBN: Required, valid ISBN format
- Genre: Required, from predefined list
- Published Date: Required, not in future
- Pages: Required, 1-10000
- Description: Required, 10-1000 characters
- Publisher: Required, max 100 characters
- Language: Required
- Price: Required, positive number
- Stock Quantity: Required, non-negative integer

### Author Validation
- First Name: Required, max 50 characters
- Last Name: Required, max 50 characters
- Email: Required, valid email format
- Biography: Optional, max 2000 characters
- Birth Date: Optional, not in future
- Nationality: Optional, max 50 characters
- Website: Optional, valid URL format

## 🛡️ Error Handling

The API includes comprehensive error handling:
- **400 Bad Request** - Validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors
- **11000 MongoDB Error** - Duplicate key errors

All errors return a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // For validation errors
}
```

## 🚧 Upcoming Features (Week 04)

- OAuth authentication
- Swagger API documentation
- Deployment to Render
- Enhanced security measures

## 📝 Development Notes

- Uses Mongoose for MongoDB ODM
- Express-validator for input validation
- CORS enabled for cross-origin requests
- Environment-based configuration
- Comprehensive logging in development mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.