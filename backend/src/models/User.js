
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must contain at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: ["APPLICANT", "RECRUITER"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    
    refreshTokenHash: {
  type: String,
  default: null,
  select: false,
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
