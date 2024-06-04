import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAnswer } from "../../Redux/slices/MbtiSlice.tsx"; // Adjust import
import styles from "./Question.module.scss";

const questions = [
    {
        id: 1,
        text: "주말에 시간이 생긴다면, 라면을 어떻게 먹고 싶나요?",
        options: [
            { text: "친구들과 함께 모여 다양한 라면을 시도한다.", value: "E" },
            { text: "혼자 조용한 곳에서 좋아하는 라면을 먹는다.", value: "I" },
        ],
    },
    {
        id: 2,
        text: "라면을 고를 때 어떤 것을 더 중시하나요?",
        options: [
            { text: "익숙하고 전통적인 맛.", value: "S" },
            { text: "독특하고 창의적인 맛.", value: "N" },
        ],
    },
    {
        id: 3,
        text: "라면을 선택할 때 어떤 요소가 더 중요한가요?",
        options: [
            { text: "가격과 성능.", value: "T" },
            { text: "먹을 때 느껴지는 감정과 분위기.", value: "F" },
        ],
    },
    {
        id: 4,
        text: "라면을 언제 먹고 싶나요?",
        options: [
            { text: "미리 계획하고 준비된 시간에 먹는다.", value: "J" },
            { text: "즉흥적으로 먹고 싶을 때 먹는다.", value: "P" },
        ],
    },
];

const Question: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const dispatch = useDispatch();
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (value: string) => {
        dispatch(addAnswer(value));
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    return (
        <div className={styles.questionContainer}>
            <h2 className={styles.questionText}>{currentQuestion.text}</h2>
            <div className={styles.options}>
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleAnswer(option.value)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Question;
