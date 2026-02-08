const Book = require("../models/Book");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/resource  (Create book)
exports.createBook = asyncHandler(async (req, res) => {
  const { title, author, category, available } = req.body;

  const book = await Book.create({
    title,
    author,
    category,
    available: available ?? true,
    owner: req.user._id,
  });

  res.status(201).json({ message: "Book created", book });
});

// GET /api/resource  (Get my books)
exports.getMyBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ count: books.length, books });
});

// GET /api/resource/:id  (Get single book)
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.status(200).json(book);
});

// PUT /api/resource/:id  (Update book)
exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  const { title, author, category, available } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (category !== undefined) book.category = category;
  if (available !== undefined) book.available = available;

  await book.save();

  res.status(200).json({ message: "Book updated", book });
});

// DELETE /api/resource/:id  (Delete book)
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  await book.deleteOne();

  res.status(200).json({ message: "Book deleted" });
});
