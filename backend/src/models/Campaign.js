const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a campaign title"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a detailed description"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Education",
        "Healthcare",
        "Disaster Relief",
        "Community Development",
      ],
    },
    targetAmount: {
      type: Number,
      required: [true, "Please set a fundraising target amount"],
      min: [10, "Target amount must be at least $10"],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Text indexing to support search queries
campaignSchema.index({ title: "text" });

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
