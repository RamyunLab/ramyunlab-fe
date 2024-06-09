import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAnswer, questionsCount } from "../../Redux/slices/MbtiSlice.tsx";
import { RootState } from "../../Redux/store";
import styles from "./Question.module.scss";
import ProgressBar from "./ProgressBar.tsx";
import loadingImage from "./pono.webp";
const questions = [
    {
        id: 1,
        text: "주말에 시간이 생긴다면, 라면을 어떻게 먹고 싶나요?",
        options: [
            { text: "가족, 친구들과 함께 라면을 먹는다.", value: "E" },
            { text: "혼자 라면을 먹는다.", value: "I" },
        ],
    },
    {
        id: 2,
        text: "라면을 고를 때 어떤 것을 더 선호하나요?",
        options: [
            { text: "항상 먹던 제품을 고른다.", value: "S" },
            { text: "신제품을 먹어본다.", value: "N" },
        ],
    },
    {
        id: 3,
        text: "라면을 선택할 때 어떤 요소가 더 중요한가요?",
        options: [
            { text: "이름과 맛에 대한 설명", value: "T" },
            { text: "라면의 디자인.", value: "F" },
        ],
    },
    {
        id: 4,
        text: "라면을 언제 먹고 싶나요?",
        options: [
            { text: "미리 계획하고 먹는다.", value: "J" },
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
        text: "라면을 먹을 때 주로 어떤 환경을 더 조성하나요?",
        options: [
            { text: "라면에만 집중한다.", value: "E" },
            { text: "TV나 유튜브를 보면서 먹는다", value: "I" },
        ],
    },
    {
        id: 7,
        text: "라면을 어떤 방식으로 끓이는 걸 선호하나요?",
        options: [
            { text: "정해진 레시피를 따른다.", value: "J" },
            { text: "여러 재료를 추가한다.", value: "P" },
        ],
    },
    {
        id: 8,
        text: "라면을 먹은 후에 어떤 생각이 드나요?",
        options: [
            { text: "괜히 먹었다", value: "T" },
            { text: "맛있게 잘 먹었다.", value: "F" },
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
                            <h2>라면 찾는 중...</h2>
                            <img
                                src={loadingImage}
                                alt="라면 이미지"
                                className={styles.questionImage}
                            />
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Question;
