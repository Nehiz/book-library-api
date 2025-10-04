const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require('../controllers/authorController');
const { validateAuthor, validateAuthorUpdate } = require('../middleware/authorValidation');

/**
 * @swagger
 * /api/v1/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of authors per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name or biography
 *     responses:
 *       200:
 *         description: List of authors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 */
router.get('/', getAuthors);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   get:
 *     summary: Get a single author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 */
router.get('/:id', getAuthor);

/**
 * @swagger
 * /api/v1/authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 */
// Add debug middleware for all author routes
router.use((req, res, next) => {
  console.log('🔍 Authors route middleware hit:', req.method, req.originalUrl);
  next();
});

// Simple test endpoint without database
router.post('/test', (req, res) => {
  console.log('🧪 TEST ENDPOINT HIT!');
  console.log('Request body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    data: req.body
  });
});

router.post('/', createAuthor);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Author not found
 */
router.put('/:id', validateAuthorUpdate, updateAuthor);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 */
router.delete('/:id', deleteAuthor);

module.exports = router;