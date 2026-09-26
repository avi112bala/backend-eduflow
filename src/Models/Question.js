const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectName: { type: String, required: true },
    topic: { type: String, required: true }, // e.g. "Kinematics", "Thermodynamics"
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true, select: false }, // Hidden from student until submission
    points: { type: Number, default: 4 },
    negativePoints: { type: Number, default: 1 },
    explanation: { type: String }
  },
  { timestamps: true }
)
const Question= mongoose.model('Question', questionSchema)
module.exports=Question
