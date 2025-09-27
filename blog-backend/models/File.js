import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  fileId: String,
  mimeType: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);
