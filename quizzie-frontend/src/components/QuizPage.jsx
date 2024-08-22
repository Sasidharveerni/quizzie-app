import React, { useState } from 'react';
import '../App.css';

function QuizPage({onSelectQuizType}) {
  const [showModal, setShowModal] = useState(true); // Initially set to true to display modal on load

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleQuizTypeSelection = (type) => {
    // Handle quiz type selection logic here
    onSelectQuizType(type)
    console.log(`Selected quiz type: ${type}`);
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Quiz name</h2>
            <input type="text" placeholder="Enter quiz name" className="quiz-input" />
            
            <h2>Quiz Type</h2>
            <div className="quiz-type-container">
              <button onClick={() => handleQuizTypeSelection('qna')} className="quiz-type-button selected">Q & A</button>
              <button onClick={() => handleQuizTypeSelection('poll')} className="quiz-type-button">Poll Type</button>
            </div>

            <div className="modal-buttons">
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
              <button onClick={handleCloseModal} className="continue-button">Continue</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizPage;
