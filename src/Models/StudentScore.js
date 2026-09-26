const mongoose = require('mongoose');

const studentScoreSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    studentName: {
      type: String,
      required: true
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
      index: true
    },
    testName: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    marksObtained: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number, // Percentage (e.g., 92.5)
      required: true
    },
    percentile: {
      type: Number, // e.g., 99.1
      default: 90.0
    },
    rank: {
      type: Number,
      default: 1
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    },
    remarks: {
      type: String,
      default: 'Test evaluated successfully'
    }
  },
  { timestamps: true }
);

// Compound index so one student can have one recorded attempt per test (or updated attempt)
studentScoreSchema.index({ studentId: 1, testId: 1 }, { unique: true });

const studentsModel= mongoose.model('StudentScore', studentScoreSchema);
module.exports =studentsModel
