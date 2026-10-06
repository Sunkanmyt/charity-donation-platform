const express = require("express");
const router = express.Router();

const {
  getProfile,
  registerUser,
  verifyEmail,
  loginUser,
  updateProfile,
  changePassword,
  refreshToken,
  getAllUsers,
} = require("../controllers/userController");

const protect = require("../middlewares/auth");
const authorize = require("../middlewares/role");
const upload = require("../middlewares/upload");

// Public routes
router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);
router.put("/password", protect, changePassword);
router.post("/refresh", protect, refreshToken);

// Admin-only routes
router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;
