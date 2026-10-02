const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

module.exports = { generateToken, generateVerificationToken };