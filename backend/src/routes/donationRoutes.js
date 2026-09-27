const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getCampaignDonations,
} = require("../controllers/donationController");

const protect = require("../middlewares/auth");

// Public route
router.get("/campaign/:campaignId", getCampaignDonations);

// Protected routes
router.post("/", protect, createDonation);
router.get("/my", protect, getMyDonations);

module.exports = router;
