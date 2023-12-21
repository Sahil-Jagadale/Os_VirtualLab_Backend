import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  videos: { type: [String], default: [] }, // Change to an array to store multiple videos
  files: { type: [String], default: [] },  // Change to an array to store multiple files
  editor: { type: String },
});

const Content = mongoose.model('Content', contentSchema);

export default Content;
