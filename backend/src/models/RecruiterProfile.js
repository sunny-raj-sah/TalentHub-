
import mongoose from "mongoose";

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    companyLogoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      maxlength: 255,
      default: "",
    },
    aboutCompany: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true }
);

const RecruiterProfile = mongoose.model(
  "RecruiterProfile",
  recruiterProfileSchema
);

export default RecruiterProfile;
