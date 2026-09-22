const express = require("express");
const router = express.Router();

const {
  createDonation,
  getMyDonations,
  getCampaignDonations,
} = require("../controllers/donationController");

const protect = require("../middlewares/auth"); 
const authorize = require("../middlewares/role");

router.post("/", protect, createDonation);
router.get("/my", protect, getMyDonations);
router.get("/campaign/:campaignId", protect, authorize("admin"), getCampaignDonations);

module.exports = router;