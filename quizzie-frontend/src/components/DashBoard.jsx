/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashBoardPage from './DashBoardPage'
import Analytics from './Analytics';
import axios from 'axios';
import showToasts from './Toast';
import QuizApp from './QuizApp';
import { useNavigate } from 'react-router';

function DashBoard({creatorData}) {

  const navigate = useNavigate();
  const [clickedPage, setClickedPage] = useState({
    dashboard: true,
    analytics: false,
    createQuiz: false,
    questionAnalysis: false
  });

  useEffect(() => {
    if(creatorData) {
      getUserQuizData();
    }
    
  }, [creatorData]);
  

  const [quizData, setQuizData] = useState(null);

  const [quizCollections, setQuizCollections] = useState(null);

  const getUserQuizData = async () => {
     try {
      const response = await axios.get(`http://localhost:5000/get/all-quiz/${creatorData._id}`);
      console.log(response)
      if(response.data.status === 'Success') {
        setQuizData({quizCnt: response.data.quizCnt, quizQues: response.data.quizQues, quizViews: response.data.quizViews});
        setQuizCollections(response.data.quizCollections);
      }
     } catch (error) {
        console.log(error);
     }
  }

  const logOutUser = () => {
    showToasts('Logged out successfully', 'success');
    localStorage.removeItem('quizzieEmail');
    localStorage.removeItem('quizzieToken');
    localStorage.removeItem('quizzieCreatorId');
    navigate('/');
  }

  if(!creatorData) {
    return (
      <div style={{textAlign: 'center'}}>
        Please login to see dashboard page
      </div>
    )
  }

  return (
    <>
    <div className='dashboard-header'>
       <div className='dashboard-screen'>
          <div className='text-header'>
            QUIZZIE
          </div>
          
          <div>
            <div className={clickedPage.dashboard ? 'selectedOpt' : ''} style={{marginBottom: '1vw', cursor: 'pointer', textAlign: 'center'}} onClick={() => setClickedPage({...clickedPage, analytics: false, dashboard: true, createQuiz: false, questionAnalysis: false})}>
                Dashboard
            </div>

            <div className={clickedPage.analytics ? 'selectedOpt' : ''} style={{marginBottom: '1vw', textAlign: 'center', cursor: 'pointer',}} onClick={() => setClickedPage({...clickedPage, analytics: true, dashboard: false, createQuiz: false, questionAnalysis: false})}>
                Analytics
            </div>

            <div className={clickedPage.createQuiz ? 'selectedOpt' : ''} style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => setClickedPage({...clickedPage, analytics: false, dashboard: false, createQuiz: true, questionAnalysis: false})}>
                Create Quiz
            </div>
          </div>

          <div>
            <hr />
            <div style={{cursor: 'pointer'}} onClick={() => logOutUser()}>
                Logout
            </div>
          </div>
       </div>
       <div style={{margin: clickedPage.questionAnalysis ? '0': '0 auto'}}>
           {clickedPage.dashboard && <DashBoardPage quizData={quizData} quizCollections={quizCollections}/>}

          {clickedPage.analytics && <Analytics quizCollections={quizCollections} setClickedPage={setClickedPage} clickedPage={clickedPage}/>}

          {clickedPage.createQuiz && <QuizApp/>}
       </div>

    </div>
    </>
  )
}

export default DashBoard