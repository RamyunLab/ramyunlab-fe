import React from "react";

import MyReviews from "../components/MyReviews/MyReviews.tsx";
import styles from "../components/MyReviews/MyReviews.module.scss";

const MbtiPage: React.FC = () => {
    return (
        <div className={styles.mbtiPage}>
            <MyReviews />
        </div>
    );
};

export default MbtiPage;
