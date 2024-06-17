import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import NavigationButtons from "../NavigationButtons/NavigationButtons.tsx";
import styles from "../MyReviews/MyReviews.module.scss";

interface Review {
    rvIdx: number;

    reviewContent: string;
    rate: number;

    userIdx: number;
    rIdx: number;
    rvContent: string;
    rvRate: number;

    rvCreatedAt: string;
    rvUpdatedAt: string;
    rvRecommendCount: number;
    userIdx: number;
    ramyunIdx: number;
    isRecommended: boolean; // 공감 여부를 추가
}

interface ReviewResponse {
    statusCode: number;
    message: string;
    data: {
        totalPages: number;
        totalElements: number;
        first: boolean;
        last: boolean;
        size: number;
        content: Review[];
        number: number;
    };
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
            const response = await axios.get<ReviewResponse>(
                `${process.env.REACT_APP_API_SERVER}/api/recReview?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200) {
                const data = response.data.data;
                setReviews(data.content);
                setCurrentPage(data.number + 1); // 페이지 번호는 0부터 시작하므로 1을 더해줌
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
        return (
            <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} color={i < rating ? "gold" : "lightgray"} />
                ))}
            </div>
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
                                    <div className={styles.reviewContent}>
                                        <div className={styles.content}>{review.reviewContent}</div>
                                        <div className={styles.date}>
                                            {new Date(review.rvCreatedAt).toLocaleDateString()}
                                        </div>
                                        <div className={styles.rating}>
                                            {renderStars(review.rate)}
                                        </div>
                                        <div className={styles.recommendCount}>
                                            <FaThumbsUp
                                                className={`thumbs-up-icon ${
                                                    review.isRecommended ? "solid" : "regular"
                                                }`}
                                            />
                                            공감 수: {review.rvRecommendCount}
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
