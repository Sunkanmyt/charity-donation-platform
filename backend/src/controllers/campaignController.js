const Campaign = require("../models/Campaign");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get all campaigns (with search, category filter, status filter & pagination)
// @route   GET /api/campaigns
// @access  Public
exports.getCampaigns = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit, 10) || 6), 50);
    const skip = (page - 1) * limit;

    // Filter out soft-deleted campaigns ($ne: true covers existing docs without the field)
    const query = { isDeleted: { $ne: true } };

    // Filter by status (all, active, completed)
    if (req.query.status && req.query.status.toLowerCase() !== "all") {
      query.status = req.query.status.toLowerCase();
    }

    // Filter by category
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    // Search by title (regex matching)
    if (req.query.search) {
      query.title = { $regex: req.query.search.trim(), $options: "i" };
    }

    const totalCampaigns = await Campaign.countDocuments(query);

    // Sort: 'active' before 'completed' alphabetically, then newest first
    const campaigns = await Campaign.find(query)
      .sort({ status: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "firstName lastName email");

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
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    }).populate("createdBy", "firstName lastName email");

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

    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "hope_share/campaigns",
      );
    }

    const campaign = await Campaign.create({
      title,
      description,
      category,
      targetAmount: Number(targetAmount),
      imageUrl: imageUrl || undefined,
      createdBy: req.user._id || req.user.id,
      isDeleted: false,
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
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "hope_share/campaigns",
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

// @desc    Soft delete campaign (Preserves financial donation history)
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin only)
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
        data: null,
      });
    }

    // Mark as deleted and mark completed so no new donations can be processed
    campaign.isDeleted = true;
    campaign.deletedAt = new Date();
    campaign.status = "completed";
    await campaign.save();

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
