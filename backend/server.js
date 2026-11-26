import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless: darek request par DB connect (cached)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({ message: "DB connection failed" });
  }
});

app.get("/", (req, res) => res.send("Blog API running"));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler (multer, mongoose, badhu ahi aavse)
app.use((err, req, res, next) => {
  console.error(err.message);
  res
    .status(err.status || 400)
    .json({ message: err.message || "Something went wrong" });
});

if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 5000, () => console.log("Server started"));
}

export default app;
