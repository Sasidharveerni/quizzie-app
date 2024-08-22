import React, { useState } from 'react';
import CreateQuizModal from './CreateQuizModal';
import QuizPage from './QuizPage';

function QuizApp() {
  const [isQuizTypeModalOpen, setIsQuizTypeModalOpen] = useState(true);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(null);

  const handleQuizTypeSelect = (quizType) => {
    setSelectedQuizType(quizType);
    setIsQuizTypeModalOpen(false);
    setIsCreateQuizModalOpen(true);
  };

  const handleCreateQuizClose = () => {
    setIsCreateQuizModalOpen(false);
    // Optionally reset state here if needed
  };

  return (
    <div>
      {isQuizTypeModalOpen && (
        <QuizPage onSelectQuizType={handleQuizTypeSelect} />
      )}
      
      {isCreateQuizModalOpen && (
        <CreateQuizModal quizType={selectedQuizType} onClose={handleCreateQuizClose} />
      )}
    </div>
  );
}

export default QuizApp;
