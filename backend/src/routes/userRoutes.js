const express = require("express");
const router = express.Router();

const {
  getProfile,
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/userController");

const protect = require("../middlewares/auth");
const authorize = require("../middlewares/role");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.patch("/password", protect, changePassword);

// Admin-only routes
router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;