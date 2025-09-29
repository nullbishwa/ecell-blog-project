import express from "express";
import multer from "multer";
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

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getPosts);
router.get("/:slug", getPost);

// Create post with optional image/video upload
router.post("/", protect, upload.single("media"), createPost);

// Update post with optional new file upload
router.put("/:id", protect, upload.single("media"), updatePost);

router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);

export default router;
