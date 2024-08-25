import React, { useState } from 'react';
import showToasts from './Toast';
import '../App.css';

function QuizPage({ onSelectQuizType, quizName, setQuizName, setIsQuizTypeModalOpen, setIsCreateQuizModalOpen }) {
  const [showModal, setShowModal] = useState(true); // Initially set to true to display modal on load
  const [selectedQuizType, setSelectedQuizType] = useState(''); // Default quiz type

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleQuizTypeSelection = (type) => {
    setSelectedQuizType(type); // Update selected quiz type
    onSelectQuizType(type); // Notify parent component
    console.log(`Selected quiz type: ${type}`);
  };

  const handleQuizName = () => {
    if(onSelectQuizType && quizName.length >= 3) {
      setIsCreateQuizModalOpen(true);
      setIsQuizTypeModalOpen(false);
    } else {
      showToasts('Please enter valid quiz name', 'error');
    }
  }

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Quiz name</h2>
            <input
              type="text"
              placeholder="Enter quiz name"
              className="quiz-input"
              onChange={(e) => setQuizName(e.target.value)}
              value={quizName}
              required
            />
            
            <h2>Quiz Type</h2>
            <div className="quiz-type-container">
              <button
                onClick={() => handleQuizTypeSelection('qna')}
                className={`quiz-type-button ${selectedQuizType === 'qna' ? 'selected' : ''}`}
              >
                Q & A
              </button>
              <button
                onClick={() => handleQuizTypeSelection('poll')}
                className={`quiz-type-button ${selectedQuizType === 'poll' ? 'selected' : ''}`}
              >
                Poll Type
              </button>
            </div>

            <div className="modal-buttons">
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
              <button onClick={() => handleQuizName()} className="continue-button">Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizPage;
