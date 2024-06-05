import React from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressText}>
                Step {currentStep} of {totalSteps}
            </div>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
    );
};

export default ProgressBar;
