/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import congoImage from './vectors/image 2.png'
import { useParams } from 'react-router';
import showToasts from './Toast';

function ResultPage() {
    const { quizId } = useParams();
    const [quizData, setQuizData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scoreBoard, setScoreBoard] = useState(false);
    const [userScore, setUserScore] = useState(0);
    const [intervalId, setIntervalId] = useState(null); // To store the interval ID for clearing it
    const [questionType, setQuestionType] = useState('');

    useEffect(() => {
        getQuizDetails();
    }, []);

    useEffect(() => {
        if (quizData.length > 0 && quizData[currentQuestionIndex]) {
            if (quizData[currentQuestionIndex].timer > 0) {
                startTimer(quizData[currentQuestionIndex].timer);
            } else {
                clearInterval(intervalId); // Clear any previous interval if the question has no timer
                setTimer(null); // Reset the timer if the question has no timer
            }
        }
    }, [quizData, currentQuestionIndex]);

    const getQuizDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/get/quiz/${quizId}`);
            if (response.data.status === 'Success') {
                console.log(response.data.quiz);
                setQuizData(response.data.quiz.questions);
                if (response.data.quiz.quizType === 'qna') {
                    setQuestionType('qna');
                } else {
                    setQuestionType('poll');
                }
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
                    handleNextQuestion(); // Automatically go to the next question
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        setIntervalId(interval); // Save interval ID to clear it when necessary
    };

    const handleNextQuestion = async () => {
        console.log('Current question index:', currentQuestionIndex);
        if (quizData[currentQuestionIndex]) {
            const questionId = quizData[currentQuestionIndex]._id;
            await submitResponse(currentQuestionIndex, questionId);

            if (currentQuestionIndex < quizData.length - 1) {
                console.log('Updating current question index to:', currentQuestionIndex + 1);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null); // Reset selected option
            } else {
                setScoreBoard(true);
            }
        }
    };

    const submitResponse = async (idx, questionId) => {
        try {
            const response = await axios.patch(`http://localhost:5000/submit/response/${quizId}`, {
                questionId,
                selectedOption
            });
            if (response.data.status !== 'Success') {
                showToasts('Error in submitting response', 'error');
            } else {
                if (questionType === 'qna' && quizData[idx].correctAns === selectedOption) {
                    setUserScore((prevScore) => prevScore + 1);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <div className='result-page-header'>
            <div className='quiz-page'>
                {!scoreBoard && quizData.length > 0 && (
                    <div key={currentQuestionIndex}>
                        <div className='quiz-page-flex'>
                            <div style={{ margin: '2%' }}>
                                {currentQuestionIndex + 1}/{quizData.length}
                            </div>

                            {timer !== null &&
                                <div className='quiz-page-timer'>
                                    00:{timer < 10 ? `0${timer}` : timer}s
                                </div>}
                        </div>

                        <div style={{ fontSize: '2.5vw' }}>
                            {quizData[currentQuestionIndex].question}
                        </div>


                        <div className='quiz-page-options'>
                            {quizData[currentQuestionIndex].optionType === 'text' &&
                                quizData[currentQuestionIndex].options.map((content, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedOption(content.text)}
                                        className={`option-grid-item ${selectedOption === content.text ? 'option-selected' : ''}`}
                                    >
                                        {content.text}
                                    </div>
                                ))
                            }

                            {quizData[currentQuestionIndex].optionType === 'image' &&
                                quizData[currentQuestionIndex].options.map((imgOption, idx) => (
                                    <img
                                        key={idx}
                                        src={imgOption.image}
                                        alt='Quiz option'
                                        onClick={() => setSelectedOption(imgOption.image)}
                                        className={`option-grid-item ${selectedOption === imgOption.image ? 'option-selected' : ''}`}
                                    />
                                ))
                            }
                        </div>

                        <div>
                            <button className='quiz-submit-btn' onClick={handleNextQuestion}>
                                {currentQuestionIndex === quizData.length - 1 ? 'Submit' : 'Next'}
                            </button>
                    </div>
                        </div>

                )}

                {questionType === 'qna' && scoreBoard && (
                    <div>
                        <h1>Congrats Quiz is completed</h1>
                        <img src={congoImage} className='congo-image' alt='' />
                        <div className='score-text'>Your score is <span style={{ color: '#60B84B' }}>{userScore}/{quizData.length}</span></div>
                    </div>
                )}

                {questionType === 'poll' && scoreBoard && (
                    <div style={{ textAlign: 'center' }}>
                        Thank you for participating in the poll
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultPage;
