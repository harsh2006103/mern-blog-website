import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinary.js";

// Upload Image or Video to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogwebsite", resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(file.buffer);
  });
};

// Get Media
const getMedia = async (req) => {
  if (req.file) {
    const result = await uploadToCloudinary(req.file);

    let type = "image";

    if (req.file.mimetype === "image/gif") {
      type = "gif";
    } else if (req.file.mimetype.startsWith("video/")) {
      type = "video";
    }

    return {
      mediaUrl: result.secure_url,
      mediaType: type,
      mediaPublicId: result.public_id,
    };
  }

  if (req.body.mediaUrl) {
    return {
      mediaUrl: req.body.mediaUrl,
      mediaType: req.body.mediaType || "link",
      mediaPublicId: "",
    };
  }

  return null;
};

// Delete Old Media
const removeOldMedia = async (blog) => {
  if (blog.mediaPublicId) {
    let type = "image";

    if (blog.mediaType === "video") {
      type = "video";
    }

    await cloudinary.uploader.destroy(blog.mediaPublicId, {
      resource_type: type,
    });
  }
};

// Check Blog ID
const checkId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      message: "Invalid blog id",
    });

    return false;
  }

  return true;
};

//get all blogs

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    for (let i = 0; i < blogs.length; i++) {
      const count = await Comment.countDocuments({
        blog: blogs[i]._id,
      });

      blogs[i] = blogs[i].toObject();
      blogs[i].commentsCount = count;
    }

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get blog by id (single blog)

export const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const count = await Comment.countDocuments({
      blog: blog._id,
    });

    const result = blog.toObject();
    result.commentsCount = count;

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//share blog

export const shareBlog = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    blog.shares = blog.shares + 1;

    await blog.save();

    res.json({
      shares: blog.shares,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get comments for a blog

export const getComments = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const comments = await Comment.find({
      blog: id,
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// like blog

export const likeBlog = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const userId = req.user._id.toString();

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (blog.likes.includes(userId)) {
      // Unlike
      blog.likes = blog.likes.filter((id) => {
        return id !== userId;
      });
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add comment to a blog

export const addComment = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const text = req.body.text;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment required",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comment = await Comment.create({
      blog: blog._id,
      name: req.user.name,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create blog

export const createBlog = async (req, res) => {
  try {
    const title = req.body.title;
    const description = req.body.description;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description required",
      });
    }

    const media = await getMedia(req);

    const blogData = {
      title: title,
      description: description,
      author: req.user._id,
    };

    if (media) {
      blogData.mediaUrl = media.mediaUrl;
      blogData.mediaType = media.mediaType;
      blogData.mediaPublicId = media.mediaPublicId;
    }

    const blog = await Blog.create(blogData);

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update blog

export const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const title = req.body.title;
    const description = req.body.description;
    const removeMedia = req.body.removeMedia;

    if (title) {
      blog.title = title;
    }

    if (description) {
      blog.description = description;
    }

    const media = await getMedia(req);

    if (media) {
      await removeOldMedia(blog);

      blog.mediaUrl = media.mediaUrl;
      blog.mediaType = media.mediaType;
      blog.mediaPublicId = media.mediaPublicId;
    } else if (removeMedia === "true") {
      await removeOldMedia(blog);

      blog.mediaUrl = "";
      blog.mediaType = "none";
      blog.mediaPublicId = "";
    }

    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete blog

export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;

    if (!checkId(id, res)) return;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Delete Cloudinary Media
    await removeOldMedia(blog);

    // Delete Blog Comments
    await Comment.deleteMany({
      blog: blog._id,
    });

    // Delete Blog
    await blog.deleteOne();

    res.json({
      message: "Blog deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
