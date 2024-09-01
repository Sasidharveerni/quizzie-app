import React, { useState } from 'react'
import QuizTable from './QuizTable'
import DeleteQuiz from './DeleteQuiz';

function Analytics({quizCollections, setClickedPage, clickedPage}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [quizId, setQuizId] = useState(null);

  const handledeleteModalClose = () => {
    setDeleteModal(false)
  }
  
  return (
    <div>
        <QuizTable quizCollections={quizCollections} setDeleteModal={setDeleteModal} setQuizId={setQuizId} setClickedPage={setClickedPage} clickedPage={clickedPage}/>
        {deleteModal && <DeleteQuiz handledeleteModalClose={handledeleteModalClose} quizId={quizId}/>}
    </div>
  )
}

export default Analytics