import Content from "../model/assignment.js";

const deleteAssignment = async (req, res) => {
    try {
      const assignmentId = req.params.id;
      await Content.findByIdAndDelete(assignmentId);
      res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error in deleting assignment' });
    }
};

export { deleteAssignment };
  