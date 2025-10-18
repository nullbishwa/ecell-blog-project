const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [String],
    image: { type: mongoose.Schema.Types.ObjectId, ref: "blogImages" }, // store GridFS file ID
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: { type: Number, default: 0 }, // <-- share count
    uploadDate: { type: Date, required: true, default: Date.now }, // 🆕 Added upload date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
