import React from 'react';
import axios from 'axios';
import showToasts from './Toast';


function DeleteQuiz({ handledeleteModalClose, quizId}) {
    const deleteQuiz = async () => {
        try {
           const response = await axios.delete(`https://quizzie-backend-g7k0.onrender.com/delete/quiz/${quizId}`);
           if(response.data.status === 'Success') {
            showToasts('Quiz deleted successfully', 'success');
           }
        } catch (error) {
            showToasts(error.response.data.message, 'error')
            console.log(error)
        }
        handledeleteModalClose();
    }
  return (
    <div className='modal-overlay'>
        <div className='modal-content'>
            <h1>Are you confirm you want to delete ?</h1>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <button className='delete-button' onClick={() => deleteQuiz()}>Confirm Delete</button>
                <button className='canceled-button' onClick={() => handledeleteModalClose()}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteQuiz