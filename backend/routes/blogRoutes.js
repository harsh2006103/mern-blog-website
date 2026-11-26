import express from "express";

import {
  getBlogs,
  getBlogById,
  likeBlog,
  shareBlog,
  getComments,
  addComment,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Get All Blogs
router.get("/", getBlogs);

// Get Single Blog
router.get("/:id", getBlogById);

// Share Blog
router.post("/:id/share", shareBlog);

// Get Comments
router.get("/:id/comments", getComments);

// Like Blog
router.post("/:id/like", protect, likeBlog);

// Add Comment
router.post("/:id/comments", protect, addComment);

// Create Blog (Admin Only)
router.post("/", protect, adminOnly, upload.single("media"), createBlog);

// Update Blog (Admin Only)
router.put("/:id", protect, adminOnly, upload.single("media"), updateBlog);

// Delete Blog (Admin Only)
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;
