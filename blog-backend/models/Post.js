import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  tags: [String],
  media: [{ fileId:String, mimeType:String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref:'Comment' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
