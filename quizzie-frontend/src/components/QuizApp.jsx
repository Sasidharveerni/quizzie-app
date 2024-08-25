import React, { useState } from 'react';
import CreateQuizModal from './CreateQuizModal';
import QuizPage from './QuizPage';
import PublishedModal from './PublishedModal';

function QuizApp() {
  const [isQuizTypeModalOpen, setIsQuizTypeModalOpen] = useState(true);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [isPublishedModalOpen, setIsPublishedModalOpen] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(null);

  const [publishedLink, setPublishedLink] = useState('');

  const [quizName, setQuizName] = useState('');

  const handleQuizTypeSelect = (quizType) => {
    setSelectedQuizType(quizType);
  };

  const handleCreateQuizClose = () => {
    setIsCreateQuizModalOpen(false);
    // Optionally reset state here if needed
  };

  const handlePublishedModalClose = () => {
    setIsPublishedModalOpen(false);
  }

  return (
    <div>
      {isQuizTypeModalOpen && (
        <QuizPage onSelectQuizType={handleQuizTypeSelect} quizName={quizName} setQuizName={setQuizName} setIsCreateQuizModalOpen={setIsCreateQuizModalOpen} setIsQuizTypeModalOpen={setIsQuizTypeModalOpen}/>
      )}
      
      {isCreateQuizModalOpen && (
        <CreateQuizModal quizName={quizName} quizType={selectedQuizType} onClose={handleCreateQuizClose} setIsPublishedModalOpen={setIsPublishedModalOpen} setPublishedLink={setPublishedLink}/>
      )}

      {isPublishedModalOpen && (
        <PublishedModal link={publishedLink} onClose={handlePublishedModalClose}/>
      )}
    </div>
  );
}

export default QuizApp;
