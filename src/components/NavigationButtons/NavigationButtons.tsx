// NavigationButtons.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./NavigationButton.module.scss";

const NavigationButtons: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const isActive = (path: string) => {
        return location.pathname === path ? styles.activeButton : "";
    };

    return (
        <div className={styles.navigationButtons}>
            <button
                className={`${styles.navButton} ${isActive("/FavoriteListPage")}`}
                onClick={() => handleNavigate("/FavoriteListPage")}
            >
                찜 목록
            </button>
            <button
                className={`${styles.navButton} ${isActive("/recently-viewed")}`}
                onClick={() => handleNavigate("/recently-viewed")}
            >
                최근 본 라면
            </button>
            <button
                className={`${styles.navButton} ${isActive("/MyReviewsPage")}`}
                onClick={() => handleNavigate("/MyReviewsPage")}
            >
                내가 쓴 리뷰
            </button>
            <button
                className={`${styles.navButton} ${isActive("/LikedReviewsPage")}`}
                onClick={() => handleNavigate("/LikedReviewsPage")}
            >
                공감한 리뷰
            </button>
        </div>
    );
};

export default NavigationButtons;
