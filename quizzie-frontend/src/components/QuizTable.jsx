import React, { useState } from 'react';
import '../App.css';
import editIcon  from './vectors/Vector.png';
import  deleteIcon  from './vectors/Vector (1).png';
import  shareIcon  from './vectors/Vector (2).png'
import QuestionAnalysis from './QuestionAnalysis';
import showToasts from './Toast';
import EditingQuestion from './EditingQuestion';

const QuizTable = ({quizCollections, setDeleteModal, setQuizId, setClickedPage, clickedPage}) => {

  const [updateScreen, setUpdateScreen] = useState(false);
  const [analysisQuizId, setAnalysisQuizId] = useState(null);
  const [editScreen, setEditScreen] = useState(false);
  const [quizzId, setQuizzId] = useState(null)

  
  
  const analysis = (id) => {
    setUpdateScreen(true);
    setAnalysisQuizId(id);
    setClickedPage({...clickedPage, questionAnalysis: true})
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(' ', ' ').replace(',', '');
  }

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      showToasts('Link copied to clipboard!', 'success');
    });
  };

  console.log(quizCollections)


  if(!quizCollections) {
    return(
      <div>
        Create a quiz
      </div>
    )
  }

  return (
    <>
    <div>
    <h1 style={{color: '#5076FF', textAlign: !updateScreen ? 'center': 'left'}}>{!updateScreen ? 'Quiz Analysis' : ''}</h1>
    {!updateScreen && <div className="quiz-table-container">
      <table className="quiz-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizCollections.map((ele, id) => (
            <tr key={id}>
              <td>{id + 1}</td>
              <td>{ele.quizName}</td>
              <td>{formatDate(ele.createdAt)}</td>
              <td>{ele.views}</td>
              <td>
                <div className="actions">
                  <button className="action-button edit" onClick={() => {setEditScreen(true); setQuizzId(ele._id)}}>
                    
                      <img src={editIcon} alt='' />
                    
                  </button>
                  <button className="action-button delete" onClick={() => {setDeleteModal(true); setQuizId(ele._id)}}>
                       <img src={deleteIcon} alt='' />
                    
                  </button>
                  <button className="action-button share" onClick={() => handleCopy(`https://quizzie-app-lemon.vercel.app/submit/${ele._id}`)}>
                    
                      <img src={shareIcon} alt='' />
                  
                  </button>
                  <div onClick={() => analysis(ele._id)} className="analysis-link">Question Wise Analysis</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>}
    </div>

      {updateScreen && 
      <QuestionAnalysis analysisQuizId={analysisQuizId}/>
        }

        {editScreen && 
        <EditingQuestion quizId={quizzId} setEditScreen={setEditScreen}/>
        }
    </>
  );
};

export default QuizTable;
