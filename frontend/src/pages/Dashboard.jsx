import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUploadCloud,
  FiLink,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiX,
  FiFileText,
} from "react-icons/fi";
import api from "../api.js";

const empty = { title: "", description: "", mediaUrl: "", mediaType: "image" };

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all blogs
  const load = async () => {
    try {
      const { data } = await api.get("/blogs");
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Reset form
  const reset = () => {
    setForm(empty);
    setFile(null);
    setEditId(null);
    setRemoveMedia(false);
    setError("");
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  };

  // Create or Update blog
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);

      if (file) {
        fd.append("media", file);
      } else if (form.mediaUrl) {
        fd.append("mediaUrl", form.mediaUrl);
        fd.append("mediaType", form.mediaType);
      }

      if (removeMedia) {
        fd.append("removeMedia", "true");
      }

      if (editId) {
        await api.put(`/blogs/${editId}`, fd);
      } else {
        await api.post("/blogs", fd);
      }

      reset();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Start editing a blog
  const edit = (b) => {
    setEditId(b._id);
    setForm({
      title: b.title,
      description: b.description,
      mediaUrl: "",
      mediaType: "image",
    });
    setFile(null);
    setRemoveMedia(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a blog
  const remove = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      load();
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-200/80 pb-6"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Studio Workspace
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
              Admin Dashboard
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 text-xs font-medium text-zinc-600 shadow-2xs self-start sm:self-auto">
            <FiFileText className="text-blue-600" />
            <span>{blogs.length} Total Posts</span>
          </div>
        </motion.div>

        {/* Add / Edit Blog Form Card */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {editId ? "Edit Blog Post" : "Create New Blog"}
            </h2>
            {editId && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
                Editing Mode
              </span>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
              transition={{ duration: 0.35 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Enter an engaging headline..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                placeholder="Write your article content..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
              />
            </div>
          </div>

          {/* Media Upload + URL Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* File Upload */}
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 flex flex-col justify-between hover:border-blue-400 hover:bg-blue-50/20 transition-colors">
              <label
                htmlFor="fileInput"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 cursor-pointer"
              >
                <FiUploadCloud className="text-blue-600" size={16} />
                <span>Upload Media (Max 4MB)</span>
              </label>

              <input
                id="fileInput"
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="block w-full text-xs text-zinc-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
              />

              {file && (
                <p className="mt-2 text-xs text-emerald-700 font-medium truncate">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Media URL */}
            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  <FiLink className="text-blue-600" size={14} />
                  <span>Or Media URL</span>
                </label>

                <select
                  value={form.mediaType}
                  onChange={(e) =>
                    setForm({ ...form, mediaType: e.target.value })
                  }
                  className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="image">Image URL</option>
                  <option value="gif">GIF URL</option>
                  <option value="video">Video (YouTube / MP4)</option>
                  <option value="link">Link URL</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="https://example.com/media.jpg"
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          {/* Remove Old Media Checkbox (Edit Mode) */}
          {editId && (
            <label className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs font-medium text-zinc-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={removeMedia}
                onChange={(e) => setRemoveMedia(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
              <span>Remove existing media from this post</span>
            </label>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : editId ? (
                <>
                  <FiEdit2 size={15} />
                  <span>Update Blog</span>
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  <span>Publish Blog</span>
                </>
              )}
            </motion.button>

            {editId && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-sm font-medium transition-all cursor-pointer"
              >
                <FiX size={16} />
                <span>Cancel</span>
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* All Blogs List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            All Published Blogs
          </h2>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-10 text-center text-sm text-zinc-500">
              No blogs found yet. Create your first post above!
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {blogs.map((b, index) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_2px_12px_rgb(0,0,0,0.02)] transition-all"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <h3 className="font-semibold text-base text-zinc-900 truncate">
                        {b.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <FiHeart className="text-rose-500" size={13} />
                          {b.likes?.length || 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiMessageCircle
                            className="text-blue-500"
                            size={13}
                          />
                          {b.commentsCount || 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiShare2 className="text-zinc-400" size={13} />
                          {b.shares || 0}
                        </span>
                      </div>
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => edit(b)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 transition-colors cursor-pointer"
                      >
                        <FiEdit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => remove(b._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      >
                        <FiTrash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
