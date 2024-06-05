import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateMBTI, resetResult, questionsCount } from "../../Redux/slices/MbtiSlice.tsx";
import { RootState } from "../../Redux/store";
import styles from "./Result.module.scss";
import { Link } from "react-router-dom";

const Result: React.FC = () => {
    const dispatch = useDispatch();
    const answers = useSelector((state: RootState) => state.mbti.answers);
    const result = useSelector((state: RootState) => state.mbti.result);

    useEffect(() => {
        console.log("useEffect triggered with answers:", answers);
        if (answers.length === questionsCount) {
            dispatch(calculateMBTI(answers));
        }
    }, [answers, dispatch]);

    useEffect(() => {
        console.log("Result updated:", result);
    }, [result]);

    const handleShareResult = () => {
        alert("결과를 공유합니다: " + JSON.stringify(result));
    };

    if (!result) return <div>라면 찾는 중....</div>;

    return (
        <div className={styles.resultPage}>
            <div className={styles.resultContainer}>
                <h2 className={styles.resultText}>나의 라면 mbti는 {result.mbtiType}입니다</h2>
                <img
                    src={result.imageUrl}
                    alt={result.ramenRecommendation}
                    className={styles.ramenImage}
                />
                <p className={styles.ramenRecommendation}>{result.ramenRecommendation}</p>
                <p className={styles.description}>{result.description}</p>
            </div>
            <div className={styles.buttonContainer}>
                <Link to="/" onClick={() => dispatch(resetResult())} className={styles.homeLink}>
                    홈으로
                </Link>
                <button className={styles.button} onClick={handleShareResult}>
                    결과 공유하기
                </button>
            </div>
        </div>
    );
};

export default Result;
