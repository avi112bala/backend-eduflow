const express = require('express');
const testscorerouter = express.Router();
const testScoreController = require('../controllers/testScoreController');

// 1. Submit & Store student marks upon quiz completion
testscorerouter.post('/submit-test-result', testScoreController.submitTestResult);

// 2. Fetch specific student's scorecards for dashboard
testscorerouter.get('/student-test-results/:studentId', testScoreController.getStudentTestResults);

// 3. Batch scoreboard for teachers & admins
testscorerouter.get('/test-scoreboard/:testId', testScoreController.getTestScoreboard);

// 4. Live Leaderboard ranking
testscorerouter.get('/test-leaderboard/:testId', testScoreController.getTestLeaderboard);

module.exports = testscorerouter;
