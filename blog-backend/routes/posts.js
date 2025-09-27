import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createPost,getPosts,getPost,updatePost,deletePost,likePost,commentPost } from '../controllers/postController.js';
const router = express.Router();

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);

export default router;
