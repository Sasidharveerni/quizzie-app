/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import DashBoardPage from './DashBoardPage'
import Analytics from './Analytics';
import QuizPage from './QuizPage';
import axios from 'axios';
import showToasts from './Toast';

function DashBoard({creatorData}) {
  const [clickedPage, setClickedPage] = useState({
    dashboard: true,
    analytics: false,
    createQuiz: false
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
        showToasts(error.message, 'error');
        console.log(error);
     }
  }

  if(!creatorData) {
    return (
      <div style={{textAlign: 'center'}}>
        Please login to see dashboard page
      </div>
    )
  }

  return (
    <div className='dashboard-header'>
       <div className='dashboard-screen'>
          <div className='text-header'>
            QUIZZIE
          </div>
          
          <div>
            <div className={clickedPage.dashboard ? 'selectedOpt' : ''} style={{marginBottom: '1vw', cursor: 'pointer', textAlign: 'center'}} onClick={() => setClickedPage({...clickedPage, analytics: false, dashboard: true, createQuiz: false})}>
                Dashboard
            </div>

            <div className={clickedPage.analytics ? 'selectedOpt' : ''} style={{marginBottom: '1vw', textAlign: 'center', cursor: 'pointer',}} onClick={() => setClickedPage({...clickedPage, analytics: true, dashboard: false, createQuiz: false})}>
                Analytics
            </div>

            <div className={clickedPage.createQuiz ? 'selectedOpt' : ''} style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => setClickedPage({...clickedPage, analytics: false, dashboard: false, createQuiz: true})}>
                Create Quiz
            </div>
          </div>

          <div>
            <hr />
            <div>
                Logout
            </div>
          </div>
       </div>
       <div style={{margin: '0 auto'}}>
           {clickedPage.dashboard && <DashBoardPage quizData={quizData} quizCollections={quizCollections}/>}

          {clickedPage.analytics && <Analytics quizCollections={quizCollections}/>}

          {clickedPage.createQuiz && <QuizPage />}

       </div>
    </div>
  )
}

export default DashBoard