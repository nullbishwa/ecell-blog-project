import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';

// ✅ Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate safe slug
    const slug = slugify(title, { lower: true, strict: true });

    // Handle uploaded files
    const media = req.files
      ? req.files.map(file => ({
          fileId: file.filename,   // multer saves with filename
          mimeType: file.mimetype,
        }))
      : [];

    const post = await Post.create({
      title,
      slug,
      content,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      media,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username role')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single post by slug
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username role')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only author or admin can update
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const { title, content, tags } = req.body;

    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) post.content = content;
    if (tags) post.tags = tags.split(',').map(t => t.trim());

    // Handle new uploads
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map(file => ({
        fileId: file.filename,
        mimeType: file.mimetype,
      }));
      post.media = [...post.media, ...newMedia]; // append
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only author or admin can delete
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Delete media files from uploads
    if (post.media && post.media.length > 0) {
      post.media.forEach(m => {
        const filePath = path.join(process.cwd(), 'uploads', m.fileId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Like/unlike post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();

    if (!post.likes.map(l => l.toString()).includes(userId)) {
      post.likes.push(req.user._id);
    } else {
      post.likes = post.likes.filter(u => u.toString() !== userId);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add comment
export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      text,
      user: req.user._id,
      post: post._id,
    });

    post.comments.push(comment._id);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username' },
      });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
