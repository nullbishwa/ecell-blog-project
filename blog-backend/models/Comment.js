import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref:'Post' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);
