import Content from '../model/assignment.js';

const addContent = async (req, res) => {
  try {
    const { category, title, video, editor } = req.body;
    const { filename } = req.file;
    const content = new Content({
      category,
      title,
      video,
      file: filename,
      editor,
    });

    await content.save();
    res.status(201).json({ message: 'Data Added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error in adding data' });
    console.log(error);
  }
};

export { addContent };


