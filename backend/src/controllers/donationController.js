const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const Campaign = require("../models/Campaign");
const User = require("../models/User");
const emailService = require("../services/emailService");

// @desc    Process a donation to a campaign & send email receipt
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, message } = req.body;

    if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({
        success: false,
        message: "A valid campaign ID is required",
        data: null,
      });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Amount must be at least 1",
        data: null,
      });
    }

    if (
      message !== undefined &&
      (typeof message !== "string" || message.length > 300)
    ) {
      return res.status(400).json({
        success: false,
        message: "Message must be text of 300 characters or fewer",
        data: null,
      });
    }

    // Verify campaign exists and is NOT soft-deleted
    const campaign = await Campaign.findOne({
      _id: campaignId,
      isDeleted: { $ne: true },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    if (campaign.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This campaign is not accepting donations",
        data: null,
      });
    }

    // Record donation in MongoDB
    const donation = await Donation.create({
      donor: req.user._id,
      campaign: campaignId,
      amount: numAmount,
      isAnonymous: Boolean(isAnonymous),
      message,
      status: "successful",
    });

    // Increment raisedAmount atomically
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { raisedAmount: numAmount },
    });

    // Return 201 immediately so frontend does not wait on external mail delivery
    res.status(201).json({
      success: true,
      message: "Donation successful",
      data: donation,
    });

    // Dispatch receipt email asynchronously in the background
    emailService
      .sendDonationConfirmationEmail(
        req.user,
        campaign.title,
        numAmount,
        donation._id,
        donation.createdAt,
      )
      .catch((err) => {
        console.error(
          "Failed to send donation confirmation email:",
          err.message,
        );
      });
  } catch (error) {
    console.error("Donation creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

// @desc    Get donation history and lifetime contribution for authenticated user
// @route   GET /api/donations/my
// @access  Private
exports.getMyDonations = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50,
    );
    const skip = (page - 1) * limit;

    const filter = { donor: req.user._id };

    // Run paginated query, total record count, and lifetime sum concurrently
    const [donations, total, sumResult] = await Promise.all([
      Donation.find(filter)
        .populate("campaign", "title isDeleted")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Donation.countDocuments(filter),
      Donation.aggregate([
        { $match: { donor: req.user._id, status: "successful" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    const totalAmount = sumResult[0]?.totalAmount || 0;

    return res.status(200).json({
      success: true,
      message: "Donation history retrieved",
      data: {
        donations,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        total, // Total number of donations made
        totalAmount, // True lifetime financial contribution in Naira
      },
    });
  } catch (error) {
    console.error("Get my donations error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

// @desc    Get all donations for a specific campaign
// @route   GET /api/donations/campaign/:campaignId
// @access  Public
exports.getCampaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
        data: null,
      });
    }

    const campaign = await Campaign.findOne({
      _id: campaignId,
      isDeleted: { $ne: true },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    const donations = await Donation.find({ campaign: campaignId })
      .populate("donor", "firstName lastName")
      .sort({ createdAt: -1 });

    const result = donations.map((d) => {
      const obj = d.toObject();
      if (obj.isAnonymous) obj.donor = null;
      return obj;
    });

    return res.status(200).json({
      success: true,
      message: "Campaign donations retrieved",
      data: result,
    });
  } catch (error) {
    console.error("Get campaign donations error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};

// @desc    Get donation history for a specific user (admin only)
// @route   GET /api/donations/user/:userId
// @access  Private/Admin
exports.getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data: null,
      });
    }

    const user = await User.findById(userId).select(
      "firstName lastName email role isActive",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50,
    );
    const skip = (page - 1) * limit;

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const filter = { donor: userObjectId };

    const [donations, total, sumResult] = await Promise.all([
      Donation.find(filter)
        .populate("campaign", "title isDeleted")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Donation.countDocuments(filter),
      Donation.aggregate([
        { $match: { donor: userObjectId, status: "successful" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
    ]);

    const totalAmount = sumResult[0]?.totalAmount || 0;

    return res.status(200).json({
      success: true,
      message: "User donation history retrieved",
      data: {
        user,
        donations,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        total,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Get user donations error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};
