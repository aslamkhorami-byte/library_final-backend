// src/controllers/userController.js
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/users/profile
exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
});

// PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  // must send at least one field
  if (!username && !email) {
    res.status(400);
    throw new Error("Send username or email to update");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // update username if provided
  if (username) user.username = username;

  // update email if provided and not same as old
  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
