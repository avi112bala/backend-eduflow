const Question = require('../Models/Question')
const QuizAttempts=require("../Models/QuizAttempt")

// 1. GET /api/tests/:testId/questions (Returns questions without leaking correctOptionIndex)
exports.getQuizQuestions = async (req, res) => {
  try {
    const { testId } = req.params

    const questions = await Question.find({ testId })
      .select('-correctOptionIndex -explanation') // Secure: don't send answers to frontend during exam

    return res.status(200).json({
      success: true,
      data: questions
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// 2. POST /api/tests/:testId/submit (Server-Side Auto-Grading & Storing Attempt)
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { testId } = req.params
    const { studentId, studentName, answers, timeSpentSeconds } = req.body

    // Fetch all questions WITH correctOptionIndex and explanations
    const questions = await Question.find({ testId }).select('+correctOptionIndex +explanation')
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, message: 'Test questions not found' })
    }

    let marksObtained = 0
    let totalMarks = 0
    let correctCount = 0
    let incorrectCount = 0
    let unattempted = 0
    const topicMap = {}

    const questionReview = questions.map((q) => {
      totalMarks += q.points
      const selected = answers ? answers[q._id.toString()] : undefined
      const isAttempted = selected !== undefined && selected !== null && selected >= 0
      const isCorrect = isAttempted && selected === q.correctOptionIndex

      // Track Topic Performance
      if (!topicMap[q.topic]) {
        topicMap[q.topic] = { total: 0, correct: 0, subject: q.subjectName }
      }
      topicMap[q.topic].total += 1

      if (!isAttempted) {
        unattempted += 1
      } else if (isCorrect) {
        correctCount += 1
        marksObtained += q.points
        topicMap[q.topic].correct += 1
      } else {
        incorrectCount += 1
        marksObtained -= (q.negativePoints || 0)
      }

      return {
        question: q,
        selectedOptionIndex: isAttempted ? selected : undefined,
        isCorrect
      }
    })

    const attemptedCount = correctCount + incorrectCount
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0

    // Topic Diagnostics
    const topicBreakdown = Object.entries(topicMap).map(([topic, stat]) => {
      const topicAcc = Math.round((stat.correct / stat.total) * 100)
      return {
        topic,
        subject: stat.subject,
        totalQuestions: stat.total,
        correctCount: stat.correct,
        accuracy: topicAcc,
        isWeak: topicAcc < 50
      }
    })

    // Save Attempt to Database
    const attempt = await QuizAttempts.create({
      testId,
      studentId,
      studentName: studentName || 'Student',
      answers,
      marksObtained: Math.max(0, marksObtained),
      totalMarks,
      accuracy,
      timeSpentSeconds,
      topicBreakdown,
      status: 'COMPLETED'
    })

    return res.status(200).json({
      success: true,
      message: 'Quiz evaluated and saved successfully',
      data: {
        attemptId: attempt._id,
        testId,
        marksObtained: attempt.marksObtained,
        totalMarks,
        accuracy,
        timeSpentSeconds,
        topicBreakdown,
        questionReview
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// 3. GET /api/test-leaderboard/:testId (Instant Leaderboard Ranked by Score & Speed)
exports.getTestLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params

    const attempts = await QuizAttempt.find({ testId })
      .sort({ marksObtained: -1, timeSpentSeconds: 1 }) // higher score first, faster time breaks ties
      .limit(50)

    const leaderboard = attempts.map((att, index) => ({
      rank: index + 1,
      studentId: att.studentId,
      studentName: att.studentName,
      score: att.marksObtained,
      totalMarks: att.totalMarks,
      accuracy: att.accuracy,
      timeSpentSeconds: att.timeSpentSeconds
    }))

    return res.status(200).json({
      success: true,
      data: leaderboard
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
