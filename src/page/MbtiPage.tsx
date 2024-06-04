import React from "react";
import { useSelector } from "react-redux";
import Question from "../components/MBTI/Question.tsx";
import Result from "../components/MBTI/Result.tsx";
import { RootState } from "../Redux/store.tsx";
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
