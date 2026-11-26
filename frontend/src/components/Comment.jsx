import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMessageSquare, FiLogIn } from "react-icons/fi";
import api, { getUser } from "../api.js";

function Comment({ blogId }) {
  const user = getUser();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Get all comments
  async function loadComments() {
    try {
      const response = await api.get("/blogs/" + blogId + "/comments");
      setComments(response.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  }

  // Load comments when opened
  useEffect(() => {
    loadComments();
  }, [blogId]);

  // Add new comment
  async function submit(e) {
    e.preventDefault();
    if (!text.trim() || posting) return;

    setPosting(true);
    try {
      await api.post("/blogs/" + blogId + "/comments", { text });
      setText("");
      await loadComments();
    } catch (err) {
      console.error("Failed to post comment", err);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
          <FiMessageSquare className="text-blue-600" size={15} />
          <span>Discussion</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-600">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Add Comment Input OR Login Prompt */}
      {user ? (
        <form onSubmit={submit} className="flex items-center gap-2.5">
          {/* Current User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-xs font-bold flex items-center justify-center uppercase shrink-0">
            {user.name?.charAt(0) || "U"}
          </div>

          {/* Input Field */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full pl-4 pr-12 py-2.5 rounded-full bg-zinc-50/90 border border-zinc-200/90 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="submit"
              disabled={posting || !text.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
              title="Post comment"
            >
              {posting ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSend size={13} />
              )}
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl bg-zinc-50/90 border border-zinc-200/80 px-4 py-3.5 flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-zinc-600">
            Join the conversation — sign in to leave a comment.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium shrink-0 transition-colors"
          >
            <FiLogIn size={13} />
            <span>Sign In</span>
          </Link>
        </div>
      )}

      {/* Comments Feed */}
      {loading ? (
        <div className="space-y-3 animate-pulse pt-1">
          <div className="h-14 bg-zinc-100 rounded-2xl" />
          <div className="h-14 bg-zinc-100 rounded-2xl w-5/6" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-xs text-zinc-400 py-4">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-3 pt-1">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200/60"
              >
                {/* Commenter Initial Avatar */}
                <div className="w-7 h-7 rounded-full bg-zinc-200/90 text-zinc-700 text-xs font-semibold flex items-center justify-center uppercase shrink-0 mt-0.5">
                  {comment.name?.charAt(0) || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900">
                      {comment.name}
                    </span>
                    {comment.createdAt && (
                      <span className="text-[11px] text-zinc-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-700 mt-0.5 leading-relaxed break-words">
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Comment;
