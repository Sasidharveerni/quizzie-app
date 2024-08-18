const express = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        const {userId} = req.params;
        const quizData = await QuizSec.find({creator: userId});
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
});

router.post('/create/quiz/:creatorId', async (req, res) => {
    try {
        const { creatorId } = req.params;
        const { quizName, quizType, questions } = req.body;
        console.log(questions);
        console.log(typeof(questions))

        // Check if `questions` is an array
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Questions must be a non-empty array'
            });
        }

        // Check the structure of each question
        questions.forEach(question => {
            if (!question.question || !question.optionType || !question.options || !question.correctAns) {
                throw new Error('Each question must include `question`, `optionType`, `options`, and `correctAns` fields');
            }
        });

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

router.patch('/submit/response/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { questionId, selectedOption } = req.body; // `selectedOption` for QnA and Poll

        const quizData = await Quiz.findById(quizId);

        if (!quizData) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Quiz not found'
            });
        }

        // Find the specific question within the quiz
        const question = quizData.questions.id(questionId);

        if (!question) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Question not found'
            });
        }

        if (quizData.quizType === 'qna') {
            // Handle QnA response
            if (question.correctAns === selectedOption) {
                // Increment the corrected count
                question.responses[0].corrected += 1;
            } else {
                // Increment the incorrected count
                question.responses[0].incorrected += 1;
            }
        } else if (quizData.quizType === 'poll') {
            // Handle Poll response
            const optionIndex = question.options.findIndex(opt => opt.text === selectedOption);

            if (optionIndex !== -1) {
                // If the response for this option doesn't exist yet, initialize it
                if (!question.responses[optionIndex]) {
                    question.responses[optionIndex] = { selectedCount: 0 };
                }
                // Increment the selectedCount for the chosen option
                question.responses[optionIndex].selectedCounts += 1;
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

        // Save the quiz after updating the response
        await quizData.save();

        return res.status(200).json({
            status: 'Success',
            data: quizData
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
});






module.exports = router;