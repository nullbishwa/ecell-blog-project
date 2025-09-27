// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogs");
const userRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => res.send("🚀 E-Cell Blogging Backend is running!"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
