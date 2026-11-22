
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: 30,
      maxlength: 10000,
    },

    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      required: true,
      validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one required skill must be provided",
      },
    },

    salary: {
      min: {
        type: Number,
        required: true,
        min: 1,
      },
      max: {
        type: Number,
        required: true,
        min: 1,
      },
      currency: {
        type: String,
        trim: true,
        uppercase: true,
        default: "INR",
        maxlength: 3,
      },
    },

    experience: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    employmentType: {
      type: String,
      required: true,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "INTERNSHIP",
        "CONTRACT",
        "FREELANCE",
      ],
    },

    workMode: {
      type: String,
      required: true,
      enum: ["REMOTE", "ONSITE", "HYBRID"],
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Validate salary range.
jobSchema.pre("validate", function () {
  if (
    this.salary?.min !== undefined &&
    this.salary?.max !== undefined &&
    this.salary.min > this.salary.max
  ) {
    this.invalidate(
      "salary.max",
      "Maximum salary must be greater than or equal to minimum salary"
    );
  }

  if (
    this.experience?.min !== undefined &&
    this.experience?.max !== undefined &&
    this.experience.min > this.experience.max
  ) {
    this.invalidate(
      "experience.max",
      "Maximum experience must be greater than or equal to minimum experience"
    );
  }
});

// Job discovery and recruiter dashboard indexes.
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ recruiter: 1, status: 1, createdAt: -1 });
jobSchema.index({ status: 1, location: 1, createdAt: -1 });
jobSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;
