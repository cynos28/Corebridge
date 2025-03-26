const Result = require("../models/Results");

class ResultController {
  // Create a new result
  static async createResult(req, res) {
    try {
      // Adjusted to use front-end field names
      const { subjectName, student, score, className, teacherName, dueDate } = req.body;
      const newResult = new Result({
        subject: subjectName,
        student,
        score,
        class: className,
        teacher: teacherName,
        date: dueDate,
      });
      await newResult.save();
      return res.status(201).json({ success: true, data: newResult });
    } catch (error) {
      console.error("Error creating result:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Retrieve all results
  static async getAllResults(req, res) {
    try {
      const results = await Result.find();
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("Error retrieving results:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Retrieve a single result by ID
  static async getResultById(req, res) {
    try {
      const { id } = req.params;
      const result = await Result.findById(id);
      if (!result) {
        return res.status(404).json({ success: false, error: "Result not found" });
      }
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error retrieving result:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update a result by ID
  static async updateResult(req, res) {
    try {
      const { id } = req.params;
      const { subjectName, student, score, className, teacherName, dueDate } = req.body;
      const updatedResult = await Result.findByIdAndUpdate(
        id,
        {
          subject: subjectName,
          student,
          score,
          class: className,
          teacher: teacherName,
          date: dueDate,
        },
        { new: true }
      );
      if (!updatedResult) {
        return res.status(404).json({ success: false, error: "Result not found" });
      }
      return res.status(200).json({ success: true, data: updatedResult });
    } catch (error) {
      console.error("Error updating result:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete a result by ID
  static async deleteResult(req, res) {
    try {
      const { id } = req.params;
      const deletedResult = await Result.findByIdAndDelete(id);
      if (!deletedResult) {
        return res.status(404).json({ success: false, error: "Result not found" });
      }
      return res.status(200).json({ success: true, message: "Result deleted successfully" });
    } catch (error) {
      console.error("Error deleting result:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = ResultController;
