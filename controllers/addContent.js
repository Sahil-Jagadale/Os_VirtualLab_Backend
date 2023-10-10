import path from 'path';
import multer from 'multer';
import Content from '../model/assignment.js';


export const addContent = async (req, res) => {
  try {
    const { category, title, video, editor } = req.body;
    const notes = req.file ? req.file.path : null;

    const content = new Content({
      category,
      title,
      video,
      notes, 
      editor,
    });

    await content.save();
    res.status(201).json({ message: 'Data Added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in adding data' });
    console.log(error);
  }
};




