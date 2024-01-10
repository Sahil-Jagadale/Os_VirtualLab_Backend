import mongoose from "mongoose";


const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  linkType: { type: String, required: true },
});

const ImpLinks = mongoose.model("Links", linkSchema);

export default ImpLinks;
