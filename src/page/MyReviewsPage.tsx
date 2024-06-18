import React from "react";

import MyReviews from "../components/MyReviews/MyReviews.tsx";
import styles from "../components/MyReviews/MyReviews.module.scss";

const MbtiPage: React.FC = () => {
    return (
        <section className={styles.mbtiPage}>
            <MyReviews />
        </section>
    );
};

export default MbtiPage;
