const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "successful",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      maxlength: 300,
      trim: true,
    },
  },
  { timestamps: true },
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
