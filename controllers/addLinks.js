import Links from "../model/ImpLinks.js";

const addLinks = async (req, res) => {
  try {
    const { title, link, linkType } = req.body;

    const clink = new Links({
      title,
      link,
      linkType,
    });

    await clink.save();
    res.status(201).json({ message: "Data Added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in adding data" });
    console.log(error);
  }
};

export { addLinks };
