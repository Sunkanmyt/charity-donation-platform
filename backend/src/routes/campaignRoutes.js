const express = require("express");
const router = express.Router();

const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");

const protect = require("../middlewares/auth");
const authorize = require("../middlewares/role");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);

// Admin-only routes
router.post("/", protect, authorize("admin"), upload.single("image"), createCampaign);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateCampaign);
router.delete("/:id", protect, authorize("admin"), deleteCampaign);

module.exports = router;
