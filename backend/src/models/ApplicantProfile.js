
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT", "FREELANCE"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    startDate: Date,
    endDate: Date,
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    degree: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    startYear: {
      type: Number,
      min: 1950,
      max: 2100,
    },
    endYear: {
      type: Number,
      min: 1950,
      max: 2100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: true }
);

const applicantProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    photoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
    },
  resumeUrl: {
  type: String,
  trim: true,
  default: "",
},

resumePublicId: {
  type: String,
  trim: true,
  default: "",
},

   resumeOriginalName: {
      type: String,
      trim: true,
      maxlength: 255,
      default: "",
    },

   resumeMimeType: {
      type: String,
      trim: true,
      default: "",
      enum: ["", "application/pdf"],
    },

   resumeSize: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

const ApplicantProfile = mongoose.model(
  "ApplicantProfile",
  applicantProfileSchema
);

export default ApplicantProfile;
