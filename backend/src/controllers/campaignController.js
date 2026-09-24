const Campaign = require("../models/Campaign");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get all campaigns (with search, category filter & pagination)
// @route   GET /api/campaigns
// @access  Public
exports.getCampaigns = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by category
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    // Search by title (regex matching)
    if (req.query.search) {
      query.title = { $regex: req.query.search.trim(), $options: "i" };
    }

    const totalCampaigns = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Campaigns retrieved successfully",
      data: {
        campaigns,
        totalCampaigns,
        totalPages: Math.ceil(totalCampaigns / limit) || 1,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error fetching campaigns",
      data: null,
    });
  }
};

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign retrieved successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid campaign ID or server error",
      data: null,
    });
  }
};

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  Private (Admin only)
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, category, targetAmount } = req.body;
    let imageUrl = req.body.imageUrl;

    if (!title || !description || !category || !targetAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide title, description, category, and targetAmount",
        data: null,
      });
    }

    // If an image file was uploaded via form-data, send to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "charity_campaigns");
    }

    const campaign = await Campaign.create({
      title,
      description,
      category,
      targetAmount: Number(targetAmount),
      imageUrl: imageUrl || undefined, // Uses schema default if undefined
      createdBy: req.user._id || req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create campaign",
      data: null,
    });
  }
};

// @desc    Update campaign (Optionally replace image)
// @route   PUT /api/campaigns/:id
// @access  Private (Admin only)
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    const updateData = { ...req.body };

    // If a new file is uploaded, update imageUrl with the new Cloudinary link
    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "charity_campaigns",
      );
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: updatedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update campaign",
      data: null,
    });
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin only)
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete campaign",
      data: null,
    });
  }
};
