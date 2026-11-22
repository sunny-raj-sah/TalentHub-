import mongoose from "mongoose";

const { Schema } = mongoose;

const bookmarkSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

// An applicant can bookmark a job only once.
bookmarkSchema.index(
  { applicant: 1, job: 1 },
  { unique: true }
);

// Efficiently retrieve an applicant's latest bookmarks.
bookmarkSchema.index({
  applicant: 1,
  createdAt: -1,
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;