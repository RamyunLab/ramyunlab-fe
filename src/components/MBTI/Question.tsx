import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAnswer, questionsCount } from "../../Redux/slices/MbtiSlice.tsx";
import { RootState } from "../../Redux/store";
import styles from "./Question.module.scss";
import ProgressBar from "./ProgressBar.tsx";

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
            { text: "가격과 양.", value: "T" },
            { text: "선호하는 맛.", value: "F" },
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
    {
        id: 5,
        text: "라면의 국물 맛을 선택할 때, 어떤 것을 더 선호하나요?",
        options: [
            { text: "맑고 깔끔한 맛.", value: "S" },
            { text: "진하고 강렬한 맛.", value: "N" },
        ],
    },
    {
        id: 6,
        text: "라면을 먹을 때 주로 어떤 환경을 더 선호하나요?",
        options: [
            { text: "활기찬 분위기에서.", value: "E" },
            { text: "조용하고 편안한 분위기에서.", value: "I" },
        ],
    },
    {
        id: 7,
        text: "라면에 추가 재료를 넣는다면, 어떤 방식을 더 선호하나요?",
        options: [
            { text: "정해진 레시피를 따른다.", value: "J" },
            { text: "자유롭게 창의적으로 넣는다.", value: "P" },
        ],
    },
    {
        id: 8,
        text: "라면을 먹은 후에 어떤 기분을 더 선호하나요?",
        options: [
            { text: "든든하고 만족스러운 느낌.", value: "T" },
            { text: "행복하고 편안한 느낌.", value: "F" },
        ],
    },
];

const Question: React.FC = () => {
    const dispatch = useDispatch();
    const answers = useSelector((state: RootState) => state.mbti.answers);
    const showResult = useSelector((state: RootState) => state.mbti.showResult);

    const handleAnswer = (value: string) => {
        dispatch(addAnswer(value));
    };

    const currentQuestion = questions[answers.length];

    return (
        <>
            {!showResult && (
                <div className={styles.questionContainer}>
                    <ProgressBar currentStep={answers.length + 1} totalSteps={questions.length} />
                    {currentQuestion && (
                        <>
                            <div className={styles.questionText}>{currentQuestion.text}</div>
                            <div className={styles.options}>
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.value}
                                        className={styles.optionButton}
                                        onClick={() => handleAnswer(option.value)}
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Question;
