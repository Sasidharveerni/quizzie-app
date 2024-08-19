import React, { useState } from 'react'
import DashBoardPage from './DashBoardPage'
import Analytics from './Analytics';
import QuizPage from './QuizPage';

function DashBoard() {
  const [clickedPage, setClickedPage] = useState({
    dashboard: true,
    analytics: false,
    createQuiz: false
  })
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
       <div>
           {clickedPage.dashboard && <DashBoardPage />}

          {clickedPage.analytics && <Analytics />}

          {clickedPage.createQuiz && <QuizPage />}

       </div>
    </div>
  )
}

export default DashBoard