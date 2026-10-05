const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      default: "Booking",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    resendEmailId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

const contactModel = mongoose.model("ContactInquiry", contactSchema);

module.exports = contactModel;
