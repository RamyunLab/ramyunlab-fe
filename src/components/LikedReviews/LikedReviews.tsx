import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../MyReviews/MyReviews.module.scss";
import NavigationButtons from "../NavigationButtons/NavigationButtons.tsx";
interface Review {
    rvIdx: number;
    userIdx: number;
    rIdx: number;
    rvContent: string;
    rvRate: number;
    rvCreatedAt: string;
    reviewPhotoUrl: string | null;
    rvUpdatedAt: string | null;
    rvDeletedAt: string | null;
    nickname: string;
    liked: boolean;
    recommendIdx: number | null;
}

interface ReviewResponse {
    reviews: Review[];
    currentPage: number;
    totalPages: number;
}

const LikedReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            fetchReviews(1);
        }
    }, []);

    const fetchReviews = async (page: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_SERVER}/api/recReview?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200) {
                const data: ReviewResponse = response.data.data;
                setReviews(data.reviews);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("리뷰 목록 불러오기 실패:", error);
            setReviews([]);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchReviews(newPage);
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }, (_, i) => (
                    <span key={`full-${i}`} className={`${styles.star} ${styles.full}`}>
                        ★
                    </span>
                ))}
                {halfStar && <span className={`${styles.star} ${styles.half}`}>☆</span>}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <span key={`empty-${i}`} className={`${styles.star} ${styles.empty}`}>
                        ☆
                    </span>
                ))}
            </>
        );
    };

    return (
        <div className={styles.myReviewsContainer}>
            <NavigationButtons />
            <h2>공감한 리뷰</h2>
            {isLoggedIn ? (
                <>
                    <div className={styles.myReviewsList}>
                        {reviews && reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.rvIdx} className={styles.reviewItem}>
                                    <h3 className={styles.nickname}>{review.nickname}</h3>
                                    <div className={styles.reviewContent}>
                                        {review.reviewPhotoUrl && (
                                            <div className={styles.reviewImage}>
                                                <img src={review.reviewPhotoUrl} alt="Review" />
                                            </div>
                                        )}
                                        <div className={styles.content}>{review.rvContent}</div>
                                        <div className={styles.date}>
                                            {new Date(review.rvCreatedAt).toLocaleDateString()}
                                        </div>
                                        <div className={styles.rating}>
                                            {renderStars(review.rvRate)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noReviews}>리뷰가 없습니다.</div>
                        )}
                    </div>
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? styles.activePage : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p>로그인 후 이용해주세요.</p>
            )}
        </div>
    );
};

export default LikedReviews;
