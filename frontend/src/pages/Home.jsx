import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiBookOpen, FiX } from "react-icons/fi";
import api from "../api.js";
import BlogCard from "../components/BlogCard.jsx";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function getBlogs() {
    try {
      const response = await api.get("/blogs");
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 pb-20">
      {/* Editorial Hero Header */}
      <section className="border-b border-zinc-200/70 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold tracking-wide text-blue-600 uppercase">
              <FiBookOpen size={13} />
              <span>The Editorial Feed</span>
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.12]">
              Latest Blogs &{" "}
              <span className="text-zinc-400">Perspectives.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl leading-relaxed">
              Explore curated stories, insights, and updates crafted for curious
              minds.
            </p>

            {/* Clean Apple-style Search Input */}
            <div className="pt-3 max-w-md">
              <div className="relative group">
                <FiSearch
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-zinc-100/80 border border-zinc-200/80 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Container: Mobile/Small = 1 col, Medium = 2 cols, Laptop/Large = 3 cols */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl border border-zinc-200/70 p-6 space-y-4"
              >
                <div className="h-3 w-24 bg-zinc-200 rounded-full" />
                <div className="h-6 w-4/5 bg-zinc-200 rounded-lg" />
                <div className="h-44 w-full bg-zinc-100 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full bg-zinc-200 rounded-full" />
                  <div className="h-3.5 w-3/4 bg-zinc-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-zinc-200/70 p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-4">
              <FiBookOpen size={22} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">
              {search ? "No matching articles" : "No blogs published yet"}
            </h3>
            <p className="text-sm text-zinc-500 mt-1">
              {search
                ? `We couldn't find any posts matching "${search}".`
                : "Check back soon for new stories and updates."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 px-5 py-2 rounded-full bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {!loading && filteredBlogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.06, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-3xl border border-zinc-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_14px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 p-5 sm:p-6 transition-all duration-300"
              >
                <BlogCard blog={blog} compact />
              </motion.article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
