const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getCampaignDonations,
  getUserDonations,
} = require("../controllers/donationController");

const protect = require("../middlewares/auth");
const authorize = require("../middlewares/role");

// Protected routes (any logged-in user)
router.post("/", protect, createDonation);
router.get("/my", protect, getMyDonations);

// Admin-only routes
router.get("/campaign/:campaignId", protect, getCampaignDonations);
router.get("/user/:userId", protect, authorize("admin"), getUserDonations);

module.exports = router;
