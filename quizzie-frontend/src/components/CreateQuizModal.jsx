import React, { useState } from 'react';
import '../App.css';
import DeleteIcon from './vectors/Vector (1).png';
import axios from 'axios';
import showToasts from './Toast';

function CreateQuizModal({ quizType, onClose, quizName, setIsPublishedModalOpen, setPublishedLink }) {
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: [{ text: '' }, { text: '' }], // Start with two options
      timer: 'off',
      optionType: 'text',
      correctAns: null, // Initialize to null
    },
  ]);
  const userId = localStorage.getItem('quizzieCreatorId') || '';
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
      newQuestions[currentQuestionIndex].options.push(
        newQuestions[currentQuestionIndex].optionType === 'text'
          ? { text: '' }
          : newQuestions[currentQuestionIndex].optionType === 'image'
            ? { image: '' }
            : { text: '', image: '' }
      );
      setQuestions(newQuestions);
    }
  };

  const handleRemoveOption = (optionIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[currentQuestionIndex].options.length > 2) {
      newQuestions[currentQuestionIndex].options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const handleOptionChange = (optionIndex, key, value) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].options[optionIndex][key] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          question: '',
          options: [{ text: '' }, { text: '' }], // Start with two options
          timer: 'off',
          optionType: 'text',
          correctAns: null,
        },
      ]);
      setCurrentQuestionIndex(questions.length);
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

    newQuestions[currentQuestionIndex].options = value === 'text'
      ? [{ text: '' }, { text: '' }] // Always start with two options
      : value === 'image'
        ? [{ image: '' }, { image: '' }]
        : [{ text: '', image: '' }, { text: '', image: '' }];

    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    if (value !== undefined) {
      newQuestions[currentQuestionIndex].correctAns = value;
    } else {
      newQuestions[currentQuestionIndex].correctAns = null;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const quizData = {
      quizName: quizName,
      quizType: quizType,
      questions: questions.map((q) => {
        const questionData = {
          question: q.question,
          options: q.options,
          timer: q.timer,
          optionType: q.optionType,
          views: 0,
        };

        if (q.correctAns !== null) {
          questionData.correctAns = q.correctAns;
        }

        return questionData;
      }),
    };

    console.log('Quiz Data:', quizData);

    try {
      const response = await axios.post(`https://quizzie-backend-g7k0.onrender.com/create/quiz/${userId}`, quizData);
      console.log(response);

      if (response.data.status === 'Success') {
        setIsPublishedModalOpen(true);
        setPublishedLink(`http://localhost:3000/submit/${response.data.quizId}`)
        showToasts('Quiz created successfully', 'success');
      }
    } catch (error) {
      showToasts(error.response.data.message, 'error');
      console.log(error);
    }

    onClose();
  };

  if (!userId) {
    return (
      <div>
        <p>Please login to create quiz</p>
      </div>
    );
  }

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
            {questions.length < 5 && (
              <div className="question-add" onClick={handleAddQuestion}>
                +
              </div>
            )}
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
              <div key={optionIndex} className="option-container">
                {quizType === 'qna' && <input
                  type="radio"
                  name={`correctAns-${currentQuestionIndex}`}
                  checked={questions[currentQuestionIndex].correctAns === (option.text || option.image)}
                  onChange={() => handleCorrectAnswerChange(optionIndex, option.text || option.image)}
                />}
                {questions[currentQuestionIndex].optionType !== 'image' && (
                  <input
                    type="text"
                    value={option.text || ''}
                    onChange={(e) => handleOptionChange(optionIndex, 'text', e.target.value)}
                    placeholder={`Option ${optionIndex + 1} Text`}
                    className="quiz-input option-input"
                  />
                )}
                {questions[currentQuestionIndex].optionType !== 'text' && (
                  <input
                    type="text"
                    value={option.image || ''}
                    onChange={(e) => handleOptionChange(optionIndex, 'image', e.target.value)}
                    placeholder={`Option ${optionIndex + 1} Image URL`}
                    className="quiz-input option-input"
                  />
                )}
                {questions[currentQuestionIndex].options.length > 2 && optionIndex > 1 && (
                  <img src={DeleteIcon} alt='' className="delete-icon" onClick={() => handleRemoveOption(optionIndex)} />
                )}
              </div>
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

          {quizType === 'qna' && 
          <div className="timer-section">
            <p>Timer</p>
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
          </div>}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">Close</button>
          <button onClick={handleSubmit} className="create-button">Create Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizModal;
