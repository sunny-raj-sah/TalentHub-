import mongoose from "mongoose";

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    applicant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    coverLetter: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

      // Legacy compatibility.
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
      // Resume snapshot captured when the applicant applies.
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

    status: {
      type: String,
      enum: [
        "PENDING",
        "SHORTLISTED",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "PENDING",
      index: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    statusUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One application per applicant per job.
applicationSchema.index(
  { applicant: 1, job: 1 },
  { unique: true }
);

// Efficient recruiter dashboard queries.
applicationSchema.index({
  recruiter: 1,
  status: 1,
  appliedAt: -1,
});

applicationSchema.index({
  applicant: 1,
  appliedAt: -1,
});

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;