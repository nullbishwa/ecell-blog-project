import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/postController.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

// Accept images/videos only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ---------------- Routes ----------------

// Get all posts
router.get("/", getPosts);

// Get single post by slug
router.get("/:slug", getPost);

// Create new post (multiple media files supported)
router.post("/", protect, upload.array("media", 5), createPost);

// Update post (optional new media files)
router.put("/:id", protect, upload.array("media", 5), updatePost);

// Delete post
router.delete("/:id", protect, deletePost);

// Like/unlike post
router.post("/:id/like", protect, likePost);

// Add comment
router.post("/:id/comment", protect, commentPost);

export default router;
