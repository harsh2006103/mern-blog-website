import mongoose from "mongoose";

// Create Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    mediaUrl: {
      type: String,
      default: "",
    },

    mediaType: {
      type: String,
      default: "none",
    },

    mediaPublicId: {
      type: String,
      default: "",
    },

    likes: {
      type: [String],
      default: [],
    },

    shares: {
      type: Number,
      default: 0,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Create and Export Blog Model
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
