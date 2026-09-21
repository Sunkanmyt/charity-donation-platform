const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getCampaignDonations,
} = require("../controllers/donationController");

const protect = require("../utils/tempAuth"); // TODO: replace with real auth middleware

router.post("/", protect, createDonation);
router.get("/my", protect, getMyDonations);
router.get("/campaign/:campaignId", protect, getCampaignDonations);

module.exports = router;