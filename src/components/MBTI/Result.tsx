import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateMBTI, resetResult } from "../../Redux/slices/MbtiSlice.tsx";
import { RootState } from "../../Redux/store";
import styles from "./Result.module.scss";
import { Link } from "react-router-dom";

const Result: React.FC = () => {
    const dispatch = useDispatch();
    const answers = useSelector((state: RootState) => state.mbti.answers);
    const result = useSelector((state: RootState) => state.mbti.result);

    useEffect(() => {
        if (answers.length === 4) {
            dispatch(calculateMBTI(answers));
        }
    }, [answers, dispatch]);

    // 결과를 공유하는 함수
    const handleShareResult = () => {
        // 여기에 결과를 공유하는 로직을 구현하세요
        alert("결과를 공유합니다: " + JSON.stringify(result));
    };

    if (!result) return <div>라면 찾는 중....</div>;

    return (
        <div className={styles.resultPage}>
            <div className={styles.resultContainer}>
                <h2 className={styles.resultText}>Your MBTI Type: {result.mbtiType}</h2>
                <p className={styles.ramenRecommendation}>
                    Ramen Recommendation: {result.ramenRecommendation}
                </p>
                <p className={styles.description}>{result.description}</p>
            </div>
            <Link to="/" onClick={() => dispatch(resetResult())} className={styles.homeLink}>
                <div>홈으로</div>
            </Link>
            <button className={styles.button} onClick={handleShareResult}>
                결과 공유하기
            </button>
        </div>
    );
};

export default Result;
