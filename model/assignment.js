import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  video: { type: String },
  file: { type: String},
  editor: { type: String },
});

const Content = mongoose.model('Content', contentSchema);

export default Content;


