import path from "path";
import multer from "multer";
import Content from "../model/assignment.js";

export const updateContent = async (req, res) => {
  const contentId = req.params.id;
  const updateData = req.body;
  const notes = req.file ? req.file.path : null;

  if (notes) {
    updateData.notes = notes;
  }

  try {
    // Check if the provided ID exists
    const existingContent = await Content.findById(contentId);
    if (!existingContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Update the content
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run validators on the updated data
      }
    );

    return res.json(updatedContent);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
