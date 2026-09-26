const mongoose = require('mongoose')

const quizAttemptSchema = new mongoose.Schema(
  {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studentName: { type: String, required: true },
    answers: {
      type: Map,
      of: Number // { questionId: selectedOptionIndex }
    },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    timeSpentSeconds: { type: Number, required: true },
    rank: { type: Number },
    percentile: { type: Number },
    topicBreakdown: [
      {
        topic: String,
        subject: String,
        totalQuestions: Number,
        correctCount: Number,
        accuracy: Number,
        isWeak: Boolean
      }
    ],
    status: { type: String, enum: ['COMPLETED', 'TIMEOUT', 'ABANDONED'], default: 'COMPLETED' }
  },
  { timestamps: true }
)

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema)
module.exports= QuizAttempt
