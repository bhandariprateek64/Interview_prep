import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Document from '../models/document.model.js';
import User from '../models/user.model.js';
const adminRouter = express.Router();

// Fetch documents based on rating
adminRouter.post('/documents', authMiddleware, async (req, res) => {
  const { rating } = req.body;

  try {
    const user = req.user; // Get authenticated user from middleware

    if (!user) {
      return res.status(404).json({ message: 'Authenticated user not found.' });
    }

    // Update the user's rating if it's null
    if (user.currentRating === null) {
      user.currentRating = rating;
      await user.save();
    }

    // Fetch documents with rating >= (rating - 1) and limit to 100
    const documents = await Document.find({ rating: { $gte: rating - 1 } })
      .limit(100)
      .select('name link');

    // Send response
    res.status(200).json({
      success: true,
      message: 'Documents fetched successfully.',
      data: {
        questionsList: documents,
        solvedQuestions: user.completedQuestionNames,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error. Please try again later.',
    });
  }
});

// Update completed questions for a user
adminRouter.post(
  '/update-completed-questions',
  authMiddleware,
  async (req, res) => {
    const { questionId } = req.body;

    try {
      const user = req.user; // Get authenticated user from middleware

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Authenticated user not found.' });
      }

      await User.updateOne(
        { _id: user._id },
        { $addToSet: { completedQuestionNames: questionId } } // Prevent duplicate entries
      );

      // Fetch updated completed questions
      const updatedUser = await User.findById(user._id).select(
        'completedQuestionNames'
      );
      res.status(200).json({
        success: true,
        message: 'Completed questions updated successfully.',
        data: updatedUser.completedQuestionNames,
      });
    } catch (error) {
      console.error('Error updating completed questions:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error. Please try again later.',
      });
    }
  }
);

// Remove completed questions for a user
adminRouter.post(
  '/remove-completed-questions',
  authMiddleware,
  async (req, res) => {
    const { questionId } = req.body;

    try {
      const user = req.user; // Get authenticated user from middleware

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Authenticated user not found.' });
      }

      await User.updateOne(
        { _id: user._id },
        { $pull: { completedQuestionNames: questionId } }
      );

      // Fetch updated completed questions
      const updatedUser = await User.findById(user._id).select(
        'completedQuestionNames'
      );
      res.status(200).json({
        success: true,
        message: 'Completed question removed successfully.',
        data: updatedUser.completedQuestionNames,
      });
    } catch (error) {
      console.error('Error removing completed question:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error. Please try again later.',
      });
    }
  }
);

export default adminRouter;
