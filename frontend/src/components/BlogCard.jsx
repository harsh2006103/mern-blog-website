import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiExternalLink,
  FiCheck,
  FiClock,
} from "react-icons/fi";

import api, { getUser } from "../api.js";
import Comment from "./Comment.jsx";

// YouTube Video URL Parser
function youtubeEmbed(url) {
  if (!url) return null;
  const videoId = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
  );
  if (videoId) {
    return "https://www.youtube.com/embed/" + videoId[1];
  }
  return null;
}

// Editorial Media Component
function Media({ url, type, compact }) {
  if (!url || type === "none") {
    return null;
  }

  const frameClass = compact
    ? "my-4 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100/60"
    : "my-6 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100/60";

  if (type === "image" || type === "gif") {
    return (
      <div className={frameClass}>
        <motion.img
          initial={{ scale: 1.02, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          src={url}
          alt="Article media"
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 hover:scale-[1.02] ${
            compact ? "h-48" : "max-h-[520px]"
          }`}
        />
      </div>
    );
  }

  if (type === "video") {
    const youtubeUrl = youtubeEmbed(url);

    if (youtubeUrl) {
      return (
        <div
          className={`${
            compact ? "my-4" : "my-6"
          } aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-950 shadow-2xs`}
        >
          <iframe
            className="h-full w-full"
            src={youtubeUrl}
            allowFullScreen
            title="Embedded video"
          />
        </div>
      );
    }

    return (
      <div
        className={`${
          compact ? "my-4" : "my-6"
        } overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-950 shadow-2xs`}
      >
        <video
          src={url}
          controls
          className={`w-full object-contain ${
            compact ? "h-48" : "max-h-[520px]"
          }`}
        />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="my-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition-all max-w-full"
    >
      <FiExternalLink size={14} className="shrink-0" />
      <span className="truncate">{url}</span>
    </a>
  );
}

// Main Apple / Google Style Blog Card
function BlogCard({ blog, compact = false }) {
  const user = getUser();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(blog.likes || []);
  const [shares, setShares] = useState(blog.shares || 0);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [liking, setLiking] = useState(false);

  const liked = user ? likes.includes(user._id) : false;

  const wordCount = blog.description ? blog.description.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  async function handleLike() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (liking) return;

    setLiking(true);
    try {
      const response = await api.post("/blogs/" + blog._id + "/like");
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Failed to like post", err);
    } finally {
      setLiking(false);
    }
  }

  async function handleShare() {
    const url = window.location.origin + "/blog/" + blog._id;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      }

      const response = await api.post("/blogs/" + blog._id + "/share");
      setShares(response.data.shares);
    } catch (error) {
      // User cancelled share sheet
    }
  }

  return (
    <div className="relative">
      {/* Floating Copy Toast */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-medium text-white shadow-xl"
          >
            <FiCheck className="text-emerald-400" size={15} />
            <span>Article link copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meta Header */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 mb-2.5">
        {blog.author?.name && (
          <div className="flex items-center gap-1.5 text-zinc-800">
            <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-[10px] font-semibold text-white flex items-center justify-center uppercase">
              {blog.author.name.charAt(0)}
            </span>
            <span className="truncate max-w-[110px]">{blog.author.name}</span>
          </div>
        )}

        {blog.author?.name && <span className="text-zinc-300">•</span>}

        <span className="inline-flex items-center gap-1 text-zinc-400">
          <FiClock size={11} />
          {readTime} min read
        </span>
      </div>

      {/* Title */}
      <h2
        className={`font-bold tracking-tight text-zinc-950 ${
          compact
            ? "text-lg sm:text-xl leading-snug line-clamp-2"
            : "text-2xl sm:text-4xl leading-[1.18]"
        }`}
      >
        <Link
          to={"/blog/" + blog._id}
          className="hover:text-blue-600 transition-colors duration-200"
        >
          {blog.title}
        </Link>
      </h2>

      {/* Media */}
      <Media url={blog.mediaUrl} type={blog.mediaType} compact={compact} />

      {/* Description */}
      <p
        className={`text-zinc-600 whitespace-pre-line font-normal ${
          compact
            ? "mt-2.5 text-sm leading-relaxed line-clamp-3"
            : "mt-5 text-base sm:text-[17px] leading-[1.75] text-zinc-700"
        }`}
      >
        {blog.description}
      </p>

      {/* Action Bar */}
      <div
        className={`${
          compact ? "mt-5 pt-4" : "mt-8 pt-5"
        } border-t border-zinc-200/70 flex items-center justify-between gap-2`}
      >
        <div className="flex items-center gap-2">
          {/* Like */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              liked
                ? "bg-rose-50/90 border-rose-200 text-rose-600"
                : "bg-zinc-50/80 border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <FiHeart
              size={14}
              className={liked ? "fill-rose-500 text-rose-500" : ""}
            />
            <span>{likes.length}</span>
          </motion.button>

          {/* Comment */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              showCommentsSection
                ? "bg-blue-50/80 border-blue-200 text-blue-600"
                : "bg-zinc-50/80 border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <FiMessageCircle size={14} />
            <span>{blog.commentsCount || 0}</span>
          </motion.button>
        </div>

        {/* Share */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-50/80 border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer"
        >
          <FiShare2 size={14} />
          <span>{shares}</span>
        </motion.button>
      </div>

      {/* Smooth Animated Comments Drawer */}
      <AnimatePresence>
        {showCommentsSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-zinc-200/70">
              <Comment blogId={blog._id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlogCard;
