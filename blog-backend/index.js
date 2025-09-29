import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import fileRoutes from './routes/files.js';

dotenv.config();
const app = express();

// -------------------- Ensure uploads folder exists --------------------
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// -------------------- CORS --------------------
app.use(cors({
  origin: 'https://ecell-blog-projectfront.onrender.com', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// -------------------- Middleware --------------------
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse URL-encoded
app.use('/uploads', express.static(uploadDir)); // serve uploaded files

// -------------------- Routes --------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// -------------------- Test route --------------------
app.get('/', (req, res) => res.send('Backend is running'));

// -------------------- MongoDB connection --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// -------------------- Global error handling --------------------
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer file upload errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Too many files uploaded' });
  }

  if (err.message === 'Only images and videos are allowed') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Server Error', error: err.message });
});

// -------------------- Start server --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
