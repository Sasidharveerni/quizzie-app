const express = require('express');
const user = require('../models/user');
const mongoose = require('mongoose');
const { Quiz, QuizSec } = require('../models/quizStep');

const router = express.Router();

router.get('/get/quiz/:quizId', async (req, res) => {
    try {
        const {quizId} = req.params;
        const quizData = await Quiz.findById(quizId);
        if(quizData) {
            res.status(200).json({
                status: 'Success',
                message: 'Quiz data: ',
                quiz: quizData
            })
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'There is no valid quiz'
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error
        })
    }
})

router.get('/get/all-quiz/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const quizData = await QuizSec.findOne({ creator: userId });

        if (quizData) {
            // Count the total number of quizzes
            const totalQuiz = quizData.quizCollections.length;

            // Calculate the total number of questions across all quizzes
            const totalQuestions = quizData.quizCollections.reduce((total, quiz) => {
                return total + quiz.questions.length;
            }, 0);

            // Calculate the total number of views/impressions across all quizzes
            const totalImpressions = quizData.quizCollections.reduce((total, quiz) => {
                return total + quiz.questions.reduce((impressionTotal, question) => {
                    return impressionTotal + question.views;
                }, 0);
            }, 0);

            res.status(200).json({
                status: 'Success',
                message: 'Quiz data: ',
                quizCollections: quizData.quizCollections,
                quizCnt: totalQuiz,
                quizQues: totalQuestions,
                quizViews: totalImpressions
            });
        } else {
            res.status(404).json({
                status: 'Failed',
                message: 'There is no valid quiz'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            error: error.message
        });
    }
});


router.post('/create/quiz/:creatorId', async (req, res) => {
    try {
        const { creatorId } = req.params;
        const { quizName, quizType, questions } = req.body;
        console.log('Received quiz data:', JSON.stringify({ quizName, quizType, questions }, null, 2));

        // Check if `questions` is an array
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Questions must be a non-empty array'
            });
        }

        if(quizType !== 'poll') {

            questions.forEach((question, index) => {
                console.log(`Checking question ${index + 1}:`, JSON.stringify(question, null, 2));
    
                if (!question.question || !question.optionType || !question.options || !question.correctAns) {
                    console.error('Error in question:', JSON.stringify(question, null, 2));
                    throw new Error('Each question must include `question`, `optionType`, `options`, and `correctAns` fields');
                }
            });
        }

        // Check the structure of each question

        const parsedQuestions = questions.map(question => {
            return {
                question: question.question,
                optionType: question.optionType,
                options: question.options,
                correctAns: question.correctAns,
                views: parseInt(question.views, 10) || 0,
                timer: parseInt(question.timer, 10) || 0
            };
        });

        // Create a new quiz
        const newQuiz = new Quiz({
            quizName,
            quizType,
            creator: creatorId,
            questions: parsedQuestions
        });

        // Save the new quiz
        await newQuiz.save();

        // Find or create the QuizSec document
        let quizSec = await QuizSec.findOne({ creator: creatorId });
        if (!quizSec) {
            quizSec = new QuizSec({ creator: creatorId });
            await quizSec.save();
        }

        // Push the newQuiz into quizCollections
        quizSec.quizCollections.push(newQuiz);
        await quizSec.save();

        const updatedUser = await user.findByIdAndUpdate(
            creatorId, // Assuming creatorId is the userId
            { $push: { quizzes: newQuiz._id } },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
        }

        // Respond with success
        res.status(200).json({
            status: 'Success',
            quizId: newQuiz._id,
            data: quizSec,
            userData: updatedUser
        });
    } catch (error) {
        console.error('Full error:', error);
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
});

router.delete('/delete/quiz/:quizId', async (req, res) => {
    try {
      const { quizId } = req.params;
      const userId = req.body.userId; // Assuming userId is sent in the request body
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      if (!mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: 'Invalid quiz ID' });
      }
  
      // Find the QuizSec document for the user
      const quizSec = await QuizSec.findOne({ creator: userId });
  
      if (!quizSec) {
        return res.status(404).json({ status: 'Failed', message: 'QuizSec not found for this user' });
      }
  
      // Find the index of the quiz to be deleted
      const quizIndex = quizSec.quizCollections.findIndex(quiz => quiz._id.toString() === quizId);
  
      if (quizIndex === -1) {
        return res.status(404).json({ status: 'Failed', message: 'Quiz not found' });
      }
  
      // Remove the quiz from the quizCollections array
      quizSec.quizCollections.splice(quizIndex, 1);
  
      // Save the updated QuizSec document
      await quizSec.save();
  
      // Remove the quiz reference from the user document
      await user.findByIdAndUpdate(userId, { $pull: { quizzes: quizId } });
  
      res.status(200).json({ status: 'success', message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  router.post('/submit/response/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionId, selectedOption } = req.body;

        // Increment quiz views
        const updatedQuizData = await Quiz.findByIdAndUpdate(quizId, {
            $inc: { views: 1 }
        }, { new: true });

        if (!updatedQuizData) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Quiz not found'
            });
        }

        // Find the index of the question within the questions array
        const questionIndex = updatedQuizData.questions.findIndex(q => q._id.toString() === questionId);

        if (questionIndex === -1) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Question not found'
            });
        }

        // Increment views for the specific question
        const updatedQuiz = await Quiz.findOneAndUpdate(
            { _id: quizId, 'questions._id': questionId },
            { $inc: { 'questions.$.views': 1 } },  // '$' is the positional operator
            { new: true }
        );

        if (updatedQuiz.quizType === 'qna') {
            const question = updatedQuiz.questions[questionIndex];
            if (question.correctAns === selectedOption) {
                if (question.responses.length === 0) {
                    question.responses.push({ corrected: 1, incorrected: 0 });
                } else {
                    question.responses[0].corrected += 1;
                }
            } else {
                if (question.responses.length === 0) {
                    question.responses.push({ corrected: 0, incorrected: 1 });
                } else {
                    question.responses[0].incorrected += 1;
                }
            }
        } else if (updatedQuiz.quizType === 'poll') {
            const question = updatedQuiz.questions[questionIndex];
            const optionIndex = question.options.findIndex(opt => opt.text === selectedOption);

            if (optionIndex !== -1) {
                const selectedOptionText = question.options[optionIndex].text;

                let existingResponseIndex = question.responses[0]?.selectedCounts?.findIndex(
                    option => option.optionText === selectedOptionText
                );

                if (existingResponseIndex !== -1 && existingResponseIndex !== undefined) {
                    question.responses[0].selectedCounts[existingResponseIndex].count += 1;
                } else {
                    if (question.responses.length === 0) {
                        question.responses.push({
                            selectedCounts: [{ optionText: selectedOptionText, count: 1 }]
                        });
                    } else {
                        question.responses[0].selectedCounts.push({
                            optionText: selectedOptionText,
                            count: 1
                        });
                    }
                }
            } else {
                return res.status(400).json({
                    status: 'Failed',
                    message: 'Selected option not found in question'
                });
            }
        } else {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid quiz type'
            });
        }

        // Save the updated quiz data
        await updatedQuiz.save();

        return res.status(200).json({
            status: 'Success',
            data: updatedQuiz
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
});









module.exports = router;