const express = require('express')
const quizrouter = express.Router()
const quizController = require('../controllers/quizController')

// Fetch test questions for student
quizrouter.get('/tests/:testId/questions', quizController.getQuizQuestions)

// Submit quiz answers & auto-grade
quizrouter.post('/tests/:testId/submit', quizController.submitQuizAttempt)

// Get live test leaderboard
quizrouter.get('/test-leaderboard/:testId', quizController.getTestLeaderboard)

module.exports = quizrouter
