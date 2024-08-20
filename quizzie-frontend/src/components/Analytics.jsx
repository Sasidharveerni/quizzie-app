import React from 'react'
import QuizTable from './QuizTable'

function Analytics({quizCollections}) {
  return (
    <div>
        <QuizTable quizCollections={quizCollections}/>
    </div>
  )
}

export default Analytics