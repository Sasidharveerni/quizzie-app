const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true }, 
    email: { type: String, required: true },
    password: { type: String, required: true },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuizSec' }]
})

const user = mongoose.model('User', userSchema);

module.exports = user;