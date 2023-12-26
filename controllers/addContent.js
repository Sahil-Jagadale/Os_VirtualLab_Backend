import Content from "../model/assignment.js";

const addContent = async (req, res) => {
  try {
    const { category, title, editor } = req.body;
    const videos = req.body.videos ? req.body.videos.split(',') : [];
    const files = req.files['files'] ? req.files['files'].map(file => file.filename) : [];

    const content = new Content({
      category,
      title,
      videos,  // Store video links as an array
      editor,
      files,
    });

    await content.save();
    res.status(201).json({ message: 'Data Added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in adding data' });
    console.log(error);
  }
};

export { addContent };
