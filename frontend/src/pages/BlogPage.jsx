import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiArrowLeft, FiShare2, FiCheck, FiAlertCircle } from "react-icons/fi";

import api from "../api.js";
import BlogCard from "../components/BlogCard.jsx";

function BlogPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Smooth Top Reading Progress Bar (Apple/Google Editorial Style)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getBlog();
  }, [id]);

  async function getBlog() {
    setError("");
    setBlog(null);
    try {
      const response = await api.get("/blogs/" + id);
      setBlog(response.data);
    } catch (err) {
      setError("We couldn't find the article you're looking for.");
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Apple-Style Minimal Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-white border border-zinc-200/80 rounded-3xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle size={24} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Article Unavailable
          </h2>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{error}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95"
          >
            <FiArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 2. Google/Apple Shimmer Skeleton Loader
  if (blog === null) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] pt-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
          <div className="h-4 w-28 bg-zinc-200 rounded-full" />
          <div className="space-y-3">
            <div className="h-10 w-3/4 bg-zinc-200 rounded-2xl" />
            <div className="h-10 w-1/2 bg-zinc-200 rounded-2xl" />
          </div>
          <div className="h-80 w-full bg-zinc-200/80 rounded-3xl" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-zinc-200 rounded-full" />
            <div className="h-4 w-5/6 bg-zinc-200 rounded-full" />
            <div className="h-4 w-4/6 bg-zinc-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Editorial Layout
  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 selection:bg-blue-500/15 selection:text-blue-700">
      {/* Top Scroll Progress Line */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 origin-left z-50"
      />

      {/* Sticky Frosted Glass Header (Apple Newsroom / Google Blog style) */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 bg-[#FBFBFD]/80 backdrop-blur-xl border-b border-zinc-200/70"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-zinc-100 group-hover:bg-zinc-200/80 flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
              <FiArrowLeft size={16} />
            </span>
            <span>All Stories</span>
          </Link>

          {/* Copy Link / Share Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-zinc-200/90 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <FiCheck className="text-emerald-600" size={14} />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <FiShare2 size={14} />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </motion.header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[28px] border border-zinc-200/70 shadow-[0_8px_40px_rgb(0,0,0,0.03)] p-6 sm:p-12 transition-all"
        >
          <BlogCard blog={blog} />
        </motion.article>

        {/* Bottom Navigation Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-10 flex items-center justify-between border-t border-zinc-200/70 pt-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft size={16} />
            <span>Explore more articles</span>
          </Link>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            Back to top ↑
          </button>
        </motion.div>
      </main>
    </div>
  );
}

export default BlogPage;
