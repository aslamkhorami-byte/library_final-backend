const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { createBookSchema, updateBookSchema } = require("../validators/bookValidator");

const {
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

router.post("/", protect, validate(createBookSchema), createBook);
router.get("/", protect, getMyBooks);
router.get("/:id", protect, getBookById);
router.put("/:id", protect, validate(updateBookSchema), updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;
