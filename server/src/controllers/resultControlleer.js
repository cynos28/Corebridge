// controllers/resultController.js
const Result = require("../models/Results");

class ResultController {
  /**
   * Create a new Result document
   * POST /results
   */
  static async createResult(req, res) {
    try {
      const { subject, student, score, class: className, teacher, date } = req.body;

      const newResult = new Result({
        subject,
        student,
        score,
        class: className, // rename to match your schema field
        teacher,
        date,
      });

      await newResult.save();
      return res.status(201).json({ success: true, data: newResult });
    } catch (error) {
      console.error("Error creating result:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get all Result documents
   * GET /results
   */
  static async getAllResults(req, res) {
    try {
      const results = await Result.find();
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error("Error retrieving results:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get a single Result by ID
   * GET /results/:id
   */
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

  /**
   * Update a Result by ID
   * PUT /results/:id
   */
  static async updateResult(req, res) {
    try {
      const { id } = req.params;
      const { subject, student, score, class: className, teacher, date } = req.body;

      const updatedResult = await Result.findByIdAndUpdate(
        id,
        {
          subject,
          student,
          score,
          class: className,
          teacher,
          date,
        },
        { new: true } // return the updated document
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

  /**
   * Delete a Result by ID
   * DELETE /results/:id
   */
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
