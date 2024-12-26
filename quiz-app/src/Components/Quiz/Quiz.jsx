import { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [questions, setQuestions] = useState(shuffleArray([...data])); // Shuffle questions
    let [question, setQuestion] = useState(questions[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [timeLeft, setTimeLeft] = useState(30); // Timer state
    let [showPopup, setShowPopup] = useState(false); // Popup state
    let [questionTimes, setQuestionTimes] = useState([]); // Track time for each question
    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    useEffect(() => {
        if (timeLeft > 0 && !result && !showPopup) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setShowPopup(true); // Show popup when time is up
            setQuestionTimes(prev => [...prev, { question: question.question, time: 30, correct: false }]); // Log time taken
        }
    }, [timeLeft, result, showPopup]);

    const checkAns = (e, ans) => {
        if (lock === false && !showPopup) {
            const timeTaken = 30 - timeLeft; // Calculate time taken for the question
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1);
                setQuestionTimes(prev => [...prev, { question: question.question, time: timeTaken, correct: true }]); // Log correct answer
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct");
                setQuestionTimes(prev => [...prev, { question: question.question, time: timeTaken, correct: false }]); // Log incorrect answer
            }
        }
    }

    const next = () => {
        if (lock === true && !showPopup) {
            if (index === questions.length - 1) {
                setResult(true);
                return 0;
            }

            setIndex(prev => prev + 1);
            setQuestion(questions[index + 1]);
            setLock(false);
            setTimeLeft(30); // Reset timer for next question
            option_array.map((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
                return null;
            });
        }
    }

    const reset = () => {
        setIndex(0);
        setQuestions(shuffleArray([...data])); // Shuffle questions again
        setQuestion(questions[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(30); // Reset timer
        setShowPopup(false); // Hide popup
        setQuestionTimes([]); // Reset question times
    }

    return (
        <div className='container'>
            <h1>Codzy Quiz</h1>
            <hr />
            {result ? <></> : <>
                <h2>Question {index + 1}</h2> {/* Display only the question number */}
                <div className="timer">Time Left: {timeLeft} seconds</div> {/* Display Timer */}
                <ul>
                    <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
                    <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question .option2}</li>
                    <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
                    <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
                </ul>
                <button onClick={next}>Next</button>
                <div className="index">{index + 1} of {questions.length} questions</div>
            </>}
            {result ? <>
                <h2>You Scored {score} out of {questions.length}</h2>
                <button onClick={reset}>Reset</button>
                <div className="analysis">
                    <h3>Analysis</h3>
                    <ul>
                        {questionTimes.map((item, idx) => (
                            <li key={idx} style={{ color: item.correct ? 'green' : 'red' }}>
                                Question: {item.question} - Time Taken: {item.time} seconds - {item.correct ? 'Correct' : 'Incorrect'}
                            </li>
                        ))}
                    </ul>
                </div>
            </> : <></>}

            {/* Popup for Time Over */}
            {showPopup && (
                <div className="popup">
                    <h2>Time Over!</h2>
                    <p>You cannot proceed further. Please reset the quiz.</p>
                    <button onClick={reset}>Reset</button>
                </div>
            )}
        </div>
    );
}

export default Quiz;