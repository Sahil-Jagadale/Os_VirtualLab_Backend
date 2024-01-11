import Content from "../model/ImpLinks.js";

const getAllLinks = async (req, res) => {
  try {
    const assignments = await Content.find();
    res.send({status: "ok", data: assignments});
  } catch (error) {
    res.status(500).json({ message: 'Error in getting Links' });
  }
};

export { getAllLinks };