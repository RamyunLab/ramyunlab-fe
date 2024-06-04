import React from "react";
import Question from "../components/MBTI/Question.tsx";
import Result from "../components/MBTI/Result.tsx";
import styles from "./MbtiPage.module.scss";

const MbtiPage: React.FC = () => {
    return (
        <div className={styles.mbtiPage}>
            <Question />
            <Result />
        </div>
    );
};

export default MbtiPage;
