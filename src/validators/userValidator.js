const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional()
});
