/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import showToasts from './Toast'

function EditingQuestion({ quizId, setEditScreen }) {
  const [questions, setQuestions] = useState([]);
  const [quizType, setQuizType] = useState('');
  const [quizName, setQuizName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    getQuizDetails();
  }, []);

  const getQuizDetails = async () => {
    try {
      const response = await axios.get(`https://quizzie-backend-g7k0.onrender.com/get/quiz/${quizId}`);
      if (response.data.status === 'Success') {
        console.log(response.data.quiz);
        setQuestions(response.data.quiz.questions);
        setQuizType(response.data.quiz.quizType);
        setQuizName(response.data.quiz.quizName);
      } else {
        console.error('Quiz is not valid or deleted');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (optionIndex, type, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].options[optionIndex][type] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (optionIndex) => {
    const updatedQuestions = [...questions];
    const selectedOption = updatedQuestions[currentQuestionIndex].options[optionIndex];

    updatedQuestions[currentQuestionIndex].correctAns = selectedOption.text || selectedOption.image;

    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };

  const handleTimerChange = (value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].timer = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    console.log('Quiz submitted', questions);
    try {
        const response = await axios.patch(`https://quizzie-backend-g7k0.onrender.com/update/quiz/${quizId}`, {
            quizName,
            quizType,
            questions
        })
        if(response.data.status === 'Success') {
            showToasts('Quiz updated successfully', 'success');
        } else {
            showToasts('There is an error updating the quiz', 'error')
        }
    } catch (error) {
        console.log(error)
    }
    onClose();
  };

  const onClose = () => {
    setEditScreen(false)
    console.log('Modal closed');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <div className="question-nav">
            <div className='question-nav-items'>
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
            </div>
            <div>
              Max 5 questions
            </div>
          </div>

          <div className="question-section">
            <input
              type="text"
              name="question"
              placeholder={`${quizType} Question ${currentQuestionIndex + 1}`}
              className="quiz-input"
              value={questions[currentQuestionIndex]?.question || ''}
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
                    checked={questions[currentQuestionIndex]?.optionType === 'text'}
                  />
                  Text
                </label>
                <label>
                  <input
                    type="radio"
                    name="optionType"
                    value="image"
                    checked={questions[currentQuestionIndex]?.optionType === 'image'}
                  />
                  Image URL
                </label>
                <label>
                  <input
                    type="radio"
                    name="optionType"
                    value="text-image"
                    checked={questions[currentQuestionIndex]?.optionType === 'text-image'}
                  />
                  Text & Image URL
                </label>
              </div>
            </div>

            {questions[currentQuestionIndex]?.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="option-container">
                {quizType === 'qna' && (
                  <input
                    type="radio"
                    name={`correctAns-${currentQuestionIndex}`}
                    checked={questions[currentQuestionIndex]?.correctAns === (option.text || option.image)}
                    onChange={() => handleCorrectAnswerChange(optionIndex)}
                  />
                )}
                {questions[currentQuestionIndex]?.optionType !== 'image' && (
                  <input
                    type="text"
                    value={option.text || ''}
                    onChange={(e) => handleOptionChange(optionIndex, 'text', e.target.value)}
                    placeholder={`Option ${optionIndex + 1} Text`}
                    className="quiz-input option-input"
                  />
                )}
                {questions[currentQuestionIndex]?.optionType !== 'text' && (
                  <input
                    type="text"
                    value={option.image || ''}
                    onChange={(e) => handleOptionChange(optionIndex, 'image', e.target.value)}
                    placeholder={`Option ${optionIndex + 1} Image URL`}
                    className="quiz-input option-input"
                  />
                )}
              </div>
            ))}
          </div>

          {quizType === 'qna' && (
            <div className="timer-section">
              <p>Timer</p>
              <div className="timer-buttons">
                <button
                  className={`timer-button ${questions[currentQuestionIndex]?.timer === 'off' ? 'active' : ''}`}
                  onClick={() => handleTimerChange('off')}
                >
                  OFF
                </button>
                <button
                  className={`timer-button ${questions[currentQuestionIndex]?.timer === '5' ? 'active' : ''}`}
                  onClick={() => handleTimerChange('5')}
                >
                  5 sec
                </button>
                <button
                  className={`timer-button ${questions[currentQuestionIndex]?.timer === '10' ? 'active' : ''}`}
                  onClick={() => handleTimerChange('10')}
                >
                  10 sec
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Close</button>
          <button onClick={handleSubmit} className="create-button">Update Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default EditingQuestion;
