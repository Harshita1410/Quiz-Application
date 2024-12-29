import { useState, useRef } from 'react';
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
    let [questions, setQuestions] = useState(shuffleArray([...data])); // Shuffle questions initially
    let [question, setQuestion] = useState(questions[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct");
            }
        }
    };

    const next = () => {
        if (lock === true) {
            if (index === questions.length - 1) {
                setResult(true);
                return;
            }

            setIndex(prevIndex => prevIndex + 1);
            setQuestion(questions[index + 1]);
            setLock(false);
            option_array.forEach(option => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    };

    const reset = () => {
        setIndex(0);
        setQuestions(shuffleArray([...data])); // Shuffle questions on reset
        setQuestion(questions[0]);
        setScore(0);
        setLock(false);
        setResult(false);
    };

    return (
        <div className='container'>
            <h1>Codzy Quiz</h1>
            <hr />
            {result ? (
                <>
                    <h2>You Scored {score} out of {questions.length}</h2>
                    <button onClick={reset}>Reset</button>
                </>
            ) : (
                <>
                    <h2>{index + 1}. {question.question}</h2>
                    <ul>
                        <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
                        <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question.option2}</li>
                        <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
                        <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
                    </ul>
                    <button onClick={next}>Next</button>
                    <div className="index">{index + 1} of {questions.length} questions</div>
                </>
            )}
        </div>
    );
};

export default Quiz;