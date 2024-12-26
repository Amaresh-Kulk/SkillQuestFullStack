// routes/AptitudeSubmission.js
const express = require('express');
const router = express.Router();
const AptitudeSubmission = require('../models/AptitudeSubmission');
const Aptitude = require('../models/Aptitude');

// @route POST /api/aptitude-submissions
// @desc Submit an answer for an aptitude question
// @access Public or Protected (based on your setup)
router.post('/', async (req, res) => {
  const { userId, questionId, selectedOption} = req.body;
  // console.log(userId);
  try {
    if (!userId || !questionId || !selectedOption) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    // Fetch the question to determine the correct answer
    const question = await Aptitude.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found.' });
    }
    // console.log(question);

    const isCorrect = question.options.some(
      (option) => option.optionText === selectedOption && option.isCorrect
    );

    // Create a new submission
    const newSubmission = new AptitudeSubmission({
      userId,
      questionId,
      selectedOption,
      isCorrect,
    });

    // Save the submission to the database
    const savedSubmission = await newSubmission.save();
    res.status(201).json({
      msg: 'Submission saved successfully.',
      submission: savedSubmission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// @route GET /api/aptitude-submissions/:userId
// @desc Get all submissions for a specific user
// @access Public or Protected (based on your setup)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await AptitudeSubmission.find({ userId })
      .populate('questionId', 'questionText')
      .exec();

    res.status(200).json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// @route GET /api/aptitude-submissions
// @desc Get all submissions (optional route for admins or analytics)
// @access Admin
router.get('/', async (req, res) => {
  try {
    const submissions = await AptitudeSubmission.find()
      .populate('userId', 'name email')
      .populate('questionId', 'questionText')
      .exec();

    res.status(200).json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

module.exports = router;
