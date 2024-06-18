import React from "react";
import Question from "../components/MBTI/Question.tsx";
import Result from "../components/MBTI/Result.tsx";
import styles from "./MbtiPage.module.scss";

const MbtiPage: React.FC = () => {
    return (
        <section className={styles.mbtiPage}>
            <Question />
            <Result />
        </section>
    );
};

export default MbtiPage;
