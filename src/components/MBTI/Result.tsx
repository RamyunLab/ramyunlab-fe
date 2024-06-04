import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateMBTI } from "../../Redux/slices/MbtiSlice.tsx";
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

    // const handleGoHome = () => {
    //     // 결과 상태를 초기화합니다.
    //     dispatch(resetResult());
    // };
    // 결과를 공유하는 함수
    const handleShareResult = () => {
        // 여기에 결과를 공유하는 로직을 구현하세요
    };

    if (!result) return <div></div>;

    return (
        <div>
            <div className={styles.resultContainer}>
                <h2 className={styles.resultText}>{result}</h2>
            </div>

            <Link to="/" onClick={() => dispatch(resetResult())}>
                <div>홈으로</div>
            </Link>
            <button className={styles.button} onClick={handleShareResult}>
                결과 공유하기
            </button>
        </div>
    );
};

export default Result;
