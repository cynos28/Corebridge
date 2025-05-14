const Assignment = require('../models/Assignments');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// CREATE
exports.createAssignment = async (req, res) => {
  try {
    const { subjectName, className, teacherName, dueDate } = req.body;
    let documentPath = '';
    
    if (req.file) {
      // Store the complete path for the document
      documentPath = `/uploads/${req.file.filename}`;
      
      // Move file to permanent storage
      const targetDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }

    const assignment = await Assignment.create({
      subjectName,
      className,
      teacherName,
      dueDate,
      document: documentPath // Store the complete path
    });
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};

// READ ALL
exports.getAssignments = async (req, res) => {
  try {
    let assignments = await Assignment.find();
    if (req.user && req.user.role === 'student' && req.user.userId) {
      assignments = assignments.map(a => {
        const obj = a.toObject();
        // Check if submissions exist and are valid
        if (a.submissions && Array.isArray(a.submissions)) {
          const sub = a.submissions.find(s => 
            s && s.student && s.student.toString() === req.user.userId
          );
          if (sub) {
            obj.studentSubmission = {
              filePath: sub.filePath,
              submittedAt: sub.submittedAt,
              grade: sub.grade,
              feedback: sub.feedback
            };
          }
        }
        return obj;
      });
    }
    res.json(assignments);
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    res.status(500).json({ message: 'Error retrieving assignments', error: error.message });
  }
};

// READ ONE
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    console.error('Error retrieving assignment:', error);
    res.status(500).json({ message: 'Error retrieving assignment', error: error.message });
  }
};

// UPDATE
exports.updateAssignment = async (req, res) => {
  try {
    const { subjectName, className, teacherName, dueDate } = req.body;
    const updateData = { subjectName, className, teacherName, dueDate };
    if (req.file) {
      const old = await Assignment.findById(req.params.id);
      if (old && old.document) {
        const oldPath = path.join(__dirname, '../uploads', old.document);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.document = `/uploads/${req.file.filename}`;
    }
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Error updating assignment', error: error.message });
  }
};

// DELETE
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.document) {
      const f = path.join(__dirname, '..', assignment.document);
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    for (const sub of assignment.submissions) {
      const p = path.join(__dirname, '../uploads/submissions', path.basename(sub.filePath));
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

// Download assignment document
exports.downloadAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || !assignment.document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Construct the absolute file path
    const filePath = path.join(__dirname, '..', assignment.document);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set content disposition and type
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(assignment.document)}`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ message: 'Error downloading document', error: error.message });
  }
};

// Submit assignment (student)
exports.submitAssignment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Initialize submissions array if it doesn't exist
    if (!assignment.submissions) {
      assignment.submissions = [];
    }

    const now = new Date();
    const due = new Date(assignment.dueDate);
    const isLate = now > due;

    // Ensure studentId is a string before comparison
    const idx = assignment.submissions.findIndex(sub => 
      sub && sub.student && sub.student.toString() === studentId.toString()
    );

    if (idx !== -1) {
      // Update existing submission
      const old = assignment.submissions[idx];
      const oldPath = path.join(__dirname, '../uploads/submissions', path.basename(old.filePath));
      if (fs.existsSync(oldPath)) {
        await fsPromises.unlink(oldPath).catch(console.error);
      }
      assignment.submissions[idx] = {
        ...old,
        filePath: req.file.filename,
        submittedAt: now
      };
    } else {
      // Add new submission
      assignment.submissions.push({
        student: studentId,
        filePath: req.file.filename,
        submittedAt: now
      });
    }

    await assignment.save();
    res.status(201).json({
      message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully',
      isLate
    });
  } catch (error) {
    // Cleanup uploaded file if something fails
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/submissions', req.file.filename);
      if (fs.existsSync(filePath)) {
        await fsPromises.unlink(filePath).catch(console.error);
      }
    }
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Error submitting assignment', error: error.message });
  }
};

// Download student submission
exports.downloadSubmission = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    let submission;
    if (req.user.role === 'student') {
      submission = assignment.submissions.find(sub => 
        sub.student.toString() === req.user.userId
      );
    } else {
      const { submissionId } = req.query;
      submission = submissionId
        ? assignment.submissions.find(sub => sub._id.toString() === submissionId)
        : assignment.submissions[0];
    }

    if (!submission || !submission.filePath) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const filePath = path.join(__dirname, '../uploads/submissions', submission.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${submission.filePath}`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading submission:', error);
    res.status(500).json({ message: 'Error downloading submission', error: error.message });
  }
};

// Grade submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId, grade, feedback } = req.body;
    if (!submissionId) return res.status(400).json({ message: 'Submission ID is required' });
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    const idx = assignment.submissions.findIndex(sub => sub._id.toString() === submissionId);
    if (idx === -1) return res.status(404).json({ message: 'Submission not found' });
    assignment.submissions[idx].grade    = grade;
    assignment.submissions[idx].feedback = feedback;
    await assignment.save();
    res.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ message: 'Error grading submission', error: error.message });
  }
};