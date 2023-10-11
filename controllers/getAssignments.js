import Content from "../model/assignment.js";

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Content.find();
    res.send({status: "ok", data: assignments});
  } catch (error) {
    res.status(500).json({ message: 'Error in getting assignments' });
  }
};

export { getAllAssignments };