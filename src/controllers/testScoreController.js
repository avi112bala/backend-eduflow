const studentsModel = require('../Models/StudentScore');

/**
 * 1. POST /api/submit-test-result
 * Saves or updates student marks when test is completed and recalculates rank
 */
exports.submitTestResult = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      testId,
      testName,
      subject,
      marksObtained,
      totalMarks,
      accuracy,
      timeSpentSeconds,
      remarks
    } = req.body;

    if (!studentId || !testId || marksObtained === undefined || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, testId, marksObtained, totalMarks'
      });
    }

    // Save or update student test result
    const scoreRecord = await studentsModel.findOneAndUpdate(
      { studentId, testId },
      {
        studentId,
        studentName: studentName || 'Student',
        testId,
        testName: testName || 'Unit Test',
        subject: subject || 'Science & Math',
        marksObtained: Number(marksObtained),
        totalMarks: Number(totalMarks),
        accuracy: Number(accuracy || 0),
        timeSpentSeconds: Number(timeSpentSeconds || 0),
        remarks: remarks || (accuracy >= 80 ? 'Excellent performance!' : 'Good attempt.')
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Auto-compute rank among all students who took this test
    const allAttempts = await studentsModel.find({ testId }).sort({ marksObtained: -1, timeSpentSeconds: 1 });
    const studentRank = allAttempts.findIndex((a) => a.studentId.toString() === studentId.toString()) + 1;
    const totalTakers = allAttempts.length;
    const percentile = totalTakers > 1
      ? Math.round(((totalTakers - studentRank) / totalTakers) * 100)
      : 99.9;

    scoreRecord.rank = studentRank;
    scoreRecord.percentile = percentile;
    await scoreRecord.save();

    return res.status(200).json({
      success: true,
      message: 'Student test score saved and scoreboard updated successfully',
      data: scoreRecord
    });
  } catch (err) {
    console.error('Error submitting test result:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2. GET /api/student-test-results/:studentId
 * Returns the student's scoreboard / past test evaluations for their dashboard
 */
exports.getStudentTestResults = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await studentsModel.find({ studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3. GET /api/test-scoreboard/:testId
 * Returns all students' marks for a given test (Batch Scoreboard for Teachers & Admins)
 */
exports.getTestScoreboard = async (req, res) => {
  try {
    const { testId } = req.params;

    const scores = await studentsModel.find({ testId })
      .sort({ marksObtained: -1, timeSpentSeconds: 1 })
      .populate('studentId', 'firstName lastName email profilPic');

    const scoreboard = scores.map((s, index) => ({
      rank: index + 1,
      studentId: s.studentId?._id || s.studentId,
      studentName: s.studentName,
      marksObtained: s.marksObtained,
      totalMarks: s.totalMarks,
      accuracy: s.accuracy,
      percentile: s.percentile,
      submittedAt: s.date
    }));

    return res.status(200).json({
      success: true,
      data: scoreboard
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4. GET /api/test-leaderboard/:testId
 * Returns top-ranking students for the leaderboard modal
 */
exports.getTestLeaderboard = async (req, res) => {
  try {
    const { testId } = req.params;

    const topScores = await studentsModel.find({ testId })
      .sort({ marksObtained: -1, timeSpentSeconds: 1 })
      .limit(50);

    const leaderboard = topScores.map((item, index) => ({
      rank: index + 1,
      studentName: item.studentName,
      studentId: item.studentId,
      score: item.marksObtained,
      totalMarks: item.totalMarks
    }));

    return res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
