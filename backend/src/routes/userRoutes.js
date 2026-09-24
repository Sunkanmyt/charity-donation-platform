const express = require("express");
const router = express.Router();

const {
  getProfile,
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const protect = require("../middlewares/auth");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, changePassword);

module.exports = router;
