const multer = require("multer");

// Store files in memory as Buffers
const storage = multer.memoryStorage();

// Ensure only image files are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpg, jpeg, png, webp) are allowed!"),
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max limit
  fileFilter,
});

module.exports = upload;
