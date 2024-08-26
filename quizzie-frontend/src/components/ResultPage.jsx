/* eslint-disable react-hooks/exhaustive-deps */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import showToasts from './Toast';

function ResultPage() {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        getQuizDetails();
    }, []);

    useEffect(() => {
        if (quizData.length > 0 && quizData[0].timer > 0) {
            startTimer(quizData[0].timer);
        }
    }, [quizData]);

    const getQuizDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/get/quiz/${quizId}`);
            if (response.data.status === 'Success') {
                setQuizData(response.data.quiz.questions);
            } else {
                showToasts('Quiz is not valid or deleted', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const startTimer = (duration) => {
        setTimer(duration);
        const interval = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const submitResponse = async (questionId) => {
        try {
            const response = await axios.post(`http://localhost:5000/submit/response/${quizId}`, {
                questionId,
                selectedOption
            });
            if (response.data.status !== 'Success') {
                showToasts('Error in submitting response', 'error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='result-page-header'>
            <div className='quiz-page'>
                {quizData.map((ele, id) => (
                    <div key={id}>
                        <div className='quiz-page-flex'>
                            <div style={{ margin: '2%' }}>
                                {id + 1}/{quizData.length}
                            </div>

                            {ele.timer > 0 && 
                            <div className='quiz-page-timer'>
                                00:{timer < 10 ? `0${timer}` : timer}s
                            </div>}
                        </div>

                        <div style={{ fontSize: '2.5vw' }}>
                            {ele.question}
                        </div>

                        <div style={{ margin: '5% 8%' }}>
                            {ele.optionType === 'text' && 
                                ele.options.map((content, idx) => (
                                    <div 
                                        key={idx} 
                                        className='quiz-page-options' 
                                        onClick={() => setSelectedOption(content.text)}
                                    >
                                        {content.text}
                                    </div>
                                ))
                            }
                            {ele.optionType === 'image' && 
                                ele.options.map((imgOption, idx) => (
                                    <img 
                                        key={idx} 
                                        src={imgOption.image} 
                                        alt='Quiz option' 
                                        onClick={() => setSelectedOption(imgOption.image)}
                                        className='quiz-page-image'
                                    />
                                ))
                            }
                        </div>

                        <div>
                            <button onClick={() => submitResponse(ele._id)}>Next</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResultPage;
