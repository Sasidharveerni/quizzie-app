/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import showToasts from './Toast';

function QuestionAnalysis({ analysisQuizId }) {
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        getQuizzes();
    }, []);

    const getQuizzes = async () => {
        try {
            const response = await axios.get(`https://quizzie-backend-g7k0.onrender.com/get/quiz/${analysisQuizId}`);
            if (response.data.status === 'Success') {
                setQuizData(response.data.quiz);
                console.log(response.data.quiz)
            } else {
                showToasts('Quiz is not valid or deleted', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ margin: '5%' }}>
            {quizData ? (
                <>
                    <div className='question-analysis-item1'>
                        <div>
                            <h1 style={{ color: '#5076FF' }}>{quizData.quizName} Question Analysis</h1>
                        </div>
                        <div style={{ color: '#FF5D01' }}>
                            <p style={{ marginBottom: '0' }}>
                                Created on : <span>{new Date(quizData.createdAt).toLocaleDateString()}</span>
                            </p>
                            <p style={{ marginTop: '0' }}>
                                Impressions : <span>{quizData.views}</span>
                            </p>
                        </div>
                    </div>

                    <div className='quiz-scrollable'>

                    {quizData.questions.map((ele, id) => (
                        <div key={ele._id}>
                            <div style={{ marginBottom: '3vw', fontSize: '2vw', fontWeight: '500' }}>
                                Q.{id + 1} {ele.question}
                            </div>

                            {quizData.quizType === 'qna' &&
                                <div className='question-analysis-options'>
                                    <div className='question-analysis-options-1'>
                                        <p style={{ fontSize: '2vw', fontWeight: '500' }}>
                                            {ele.responses.reduce((acc, curr) => acc + curr.corrected + curr.incorrected, 0)}
                                        </p>
                                        <p>people attempted the question</p>
                                    </div>
                                    <div className='question-analysis-options-1'>
                                        <p style={{ fontSize: '2vw', fontWeight: '500' }}>
                                            {ele.responses.reduce((acc, curr) => acc + curr.corrected, 0)}
                                        </p>
                                        <p>people answered correctly</p>
                                    </div>
                                    <div className='question-analysis-options-1'>
                                        <p style={{ fontSize: '2vw', fontWeight: '500' }}>
                                            {ele.responses.reduce((acc, curr) => acc + curr.incorrected, 0)}
                                        </p>
                                        <p>people answered incorrectly</p>
                                    </div>
                                    <div style={{ marginBottom: '0.5vw' }}>
                                        <hr />
                                    </div>
                                </div>}

                            {quizData.quizType === 'poll' &&
                                <div className='question-analysis-options'>
                                    {ele.responses[0].selectedCounts.map((countData, idx) => (
                                        <div key={idx} style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}} className='question-analysis-options-1'>
                                            <p style={{ fontSize: '3vw', fontWeight: '500' }}>
                                                {countData.count} {/* Display the count */}
                                            </p>
                                            <p>Option {idx + 1}</p> {/* Display the option text */}
                                        </div>
                                    ))}
                                </div>
                            }

                        </div>
                    ))}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default QuestionAnalysis;
