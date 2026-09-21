const express = require("express");
const router = express.Router();
const { getProfile, registerUser, loginUser, updateProfile,changePassword } = require("../controllers/userController");
const authenticateUser = require("../middlewares/auth");

router.get("/",authenticateUser, getProfile);
router.post("/register", registerUser )
router.post("/login", loginUser)
router.patch("/profile", authenticateUser, updateProfile);
router.patch("/password", authenticateUser, changePassword);

module.exports = router;