const Assignment = require("../models/Assignments");

// CREATE
exports.createAssignment = async (req, res) => {
  try {
    const { subjectName, className, teacherName, dueDate } = req.body;
    let documentFile = "";
    if (req.file) {
      documentFile = req.file.filename; // store filename
    }

    const assignment = await Assignment.create({
      subjectName,
      className,
      teacherName,
      dueDate,
      document: documentFile,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Error creating assignment", error });
  }
};

// READ ALL
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error("Error retrieving assignments:", error);
    res.status(500).json({ message: "Error retrieving assignments", error });
  }
};

// READ ONE
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    res.status(500).json({ message: "Error retrieving assignment", error });
  }
};

// UPDATE
exports.updateAssignment = async (req, res) => {
  try {
    const { subjectName, className, teacherName, dueDate } = req.body;
    let updateData = { subjectName, className, teacherName, dueDate };

    if (req.file) {
      updateData.document = req.file.filename;
    }

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Error updating assignment", error });
  }
};

// DELETE
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Error deleting assignment", error });
  }
};
