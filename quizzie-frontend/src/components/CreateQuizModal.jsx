import React, { useState } from 'react';
import '../App.css';

function CreateQuizModal({ quizType, onClose }) {
  const [questions, setQuestions] = useState([{ question: '', options: [''], timer: 'off', optionType: 'image' }]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleInputChange = (e) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex] = {
      ...newQuestions[currentQuestionIndex],
      [e.target.name]: e.target.value,
    };
    setQuestions(newQuestions);
  };

  const handleAddOption = () => {
    const newQuestions = [...questions];
    if (newQuestions[currentQuestionIndex].options.length < 4) {
      newQuestions[currentQuestionIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const handleOptionChange = (optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { question: '', options: [''], timer: 'off', optionType: 'image' }]);
      setCurrentQuestionIndex(questions.length); // Move to the newly added question
    }
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleTimerChange = (value) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].timer = value;
    setQuestions(newQuestions);
  };

  const handleOptionTypeChange = (value) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].optionType = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    const quizData = {
      quizName: 'Quiz Example',
      quizType: quizType,
      questions: questions.map((q) => ({
        ...q,
        views: 0,
      })),
    };
    console.log('Quiz Data:', quizData);
    // Here, you would send `quizData` to your API endpoint
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create {quizType} Quiz</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="question-nav">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`question-circle ${index === currentQuestionIndex ? 'active' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
                <span className="remove-question" onClick={(e) => { e.stopPropagation(); handleRemoveQuestion(index); }}>x</span>
              </div>
            ))}
            {questions.length < 5 && (
              <div className="question-add" onClick={handleAddQuestion}>
                +
              </div>
            )}
          </div>

          <div className="question-section">
            <input
              type="text"
              name="question"
              placeholder={`${quizType} Question ${currentQuestionIndex + 1}`}
              className="quiz-input"
              value={questions[currentQuestionIndex].question}
              onChange={handleInputChange}
            />

            <div className="option-type">
              <label>Option Type</label>
              <div className="option-type-buttons">
                <label>
                  <input
                    type="radio"
                    name="optionType"
                    value="text"
                    checked={questions[currentQuestionIndex].optionType === 'text'}
                    onChange={() => handleOptionTypeChange('text')}
                  />
                  Text
                </label>
                <label>
                  <input
                    type="radio"
                    name="optionType"
                    value="image"
                    checked={questions[currentQuestionIndex].optionType === 'image'}
                    onChange={() => handleOptionTypeChange('image')}
                  />
                  Image URL
                </label>
                <label>
                  <input
                    type="radio"
                    name="optionType"
                    value="text-image"
                    checked={questions[currentQuestionIndex].optionType === 'text-image'}
                    onChange={() => handleOptionTypeChange('text-image')}
                  />
                  Text & Image URL
                </label>
              </div>
            </div>

            {questions[currentQuestionIndex].options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                className="quiz-input option-input"
              />
            ))}

            {questions[currentQuestionIndex].options.length < 4 && (
              <button
                onClick={handleAddOption}
                className="add-option-button"
              >
                Add Option
              </button>
            )}
          </div>

          <div className="timer-section">
            <label>Timer</label>
            <div className="timer-buttons">
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === 'off' ? 'active' : ''}`}
                onClick={() => handleTimerChange('off')}
              >
                OFF
              </button>
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === '5' ? 'active' : ''}`}
                onClick={() => handleTimerChange('5')}
              >
                5 sec
              </button>
              <button
                className={`timer-button ${questions[currentQuestionIndex].timer === '10' ? 'active' : ''}`}
                onClick={() => handleTimerChange('10')}
              >
                10 sec
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Cancel</button>
          <button onClick={handleSubmit} className="create-button">Create Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizModal;
