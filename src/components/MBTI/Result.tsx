import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateMBTI } from "../../Redux/slices/MbtiSlice.tsx";
import { RootState } from "../../Redux/store";
import styles from "./Result.module.scss";
const Result: React.FC = () => {
    const dispatch = useDispatch();
    const answers = useSelector((state: RootState) => state.mbti.answers);
    const result = useSelector((state: RootState) => state.mbti.result);

    useEffect(() => {
        if (answers.length === 4) {
            dispatch(calculateMBTI(answers));
        }
    }, [answers, dispatch]);

    if (!result) return <div></div>;

    return (
        <div className={styles.resultContainer}>
            <h2 className={styles.resultText}>Your MBTI Type and Ramen Recommendation: {result}</h2>
        </div>
    );
};
export default Result;
