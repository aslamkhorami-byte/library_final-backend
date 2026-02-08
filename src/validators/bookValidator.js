const Joi = require("joi");

// برای ساخت کتاب (POST)
const createBookSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  author: Joi.string().min(2).max(100).required(),
  category: Joi.string().min(2).max(50).required(),
  available: Joi.boolean().default(true),
});

// برای ویرایش کتاب (PUT) - همه فیلدها اختیاری
const updateBookSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  author: Joi.string().min(2).max(100),
  category: Joi.string().min(2).max(50),
  available: Joi.boolean(),
}).min(1); // حداقل یک فیلد باید ارسال شود

module.exports = { createBookSchema, updateBookSchema };
