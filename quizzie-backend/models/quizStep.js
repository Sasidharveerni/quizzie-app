const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: function() {
            return ['text', 'textimage'].includes(this.parent().parent().optionType);
        }
    },
    image: {
        type: String,
        required: function() {
            return ['image', 'textimage'].includes(this.parent().parent().optionType);
        }
    }
}, { _id: false });

const responseSchema = new mongoose.Schema({
    corrected: {
        type: Number,
        default: 0
    },
    incorrected: {
        type: Number,
        default: 0
    },
    selectedCounts: [{
        optionText: { type: String, required: true },
        count: { type: Number, default: 0 }
    }]
}, { _id: false });

const quizStepSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    optionType: {
        type: String,
        enum: ['text', 'image', 'textimage'],
        required: true
    },
    options: {
        type: [optionSchema],
        validate: {
            validator: function (v) {
                return v.length >= 2 && v.length <= 4;
            },
            message: props => `Options array length should be between 2 and 4, got ${props.value.length}`
        },
        required: true
    },
    correctAns: {
        type: String,
        required: true
    },
    timer: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    responses: [responseSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define the Quiz Schema
const quizSchema = new mongoose.Schema({
    quizName: { type: String, required: true },
    quizType: {
        type: String,
        enum: ['qna', 'poll'],
        required: true
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [quizStepSchema],  // Array of questions for each quiz
    createdAt: { type: Date, default: Date.now },
});

// Define the QuizSec Schema
const quizSecSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizCollections: [quizSchema]  // Array of quizzes
});

// Create the models
const Quiz = mongoose.model('Quiz', quizSchema);
const QuizSec = mongoose.model('QuizSec', quizSecSchema);

module.exports = { Quiz, QuizSec };
