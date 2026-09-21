const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
require("../models/User");

// POST /api/donations
const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, message } = req.body;

    if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ success: false, message: "A valid campaign ID is required", data: null });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be greater than 0", data: null });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", data: null });
    }
    if (campaign.status !== "active") {
      return res.status(400).json({ success: false, message: "This campaign is not accepting donations", data: null });
    }

    // Payment is simulated, so the donation is recorded as successful
    const donation = await Donation.create({
      donor: req.user._id,
      campaign: campaignId,
      amount: numAmount,
      isAnonymous: Boolean(isAnonymous),
      message,
      status: "successful",
    });

    await Campaign.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: numAmount } });

    return res.status(201).json({ success: true, message: "Donation successful", data: donation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong", data: null });
  }
};

// GET /api/donations/my?page=1&limit=10
const getMyDonations = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const filter = { donor: req.user._id };

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .populate("campaign", "title")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Donation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Donation history retrieved",
      data: { donations, page, totalPages: Math.ceil(total / limit), total },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong", data: null });
  }
};


// GET /api/donations/campaign/:campaignId  (admin or campaign creator)
const getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ success: false, message: "Invalid campaign ID", data: null });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found", data: null });
    }

    // TODO: after real auth is merged, allow only admin or the campaign creator

    const donations = await Donation.find({ campaign: campaignId })
      .populate("donor", "name")
      .sort({ createdAt: -1 });

    // Hide donor identity on anonymous donations
    const result = donations.map((d) => {
      const obj = d.toObject();
      if (obj.isAnonymous) obj.donor = null;
      return obj;
    });

    return res.status(200).json({ success: true, message: "Campaign donations retrieved", data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Something went wrong", data: null });
  }
};

module.exports = { createDonation, getMyDonations, getCampaignDonations };