import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import NavigationButtons from "../NavigationButtons/NavigationButtons.tsx";
import Pagination from "../Pagination/Pagination.tsx"; // Pagination 컴포넌트 임포트
import styles from "./MyReviews.module.scss";
import { useNavigate } from "react-router-dom";

interface Review {
    rvIdx: number;
    reviewContent: string;
    rate: number;
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

const MyReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            fetchReviews(1);
        }
    }, []);

    const handleItemOnclick = async (reviewNo: number, ramyunIdx: number) => {
        const url = `${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/my?reviewNo=${reviewNo}`;
        await axios
            .get(url)
            .then((res) =>
                navigate(
                    `/main/ramyun/${ramyunIdx}/review?reviewNo=${reviewNo}&page=${res.data.data}`
                )
            );
    };

    const fetchReviews = async (page: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get<ReviewResponse>(
                `${process.env.REACT_APP_API_SERVER}/api/user/myReview?page=${page}`,
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
            {/* <h2>내가 쓴 리뷰</h2> */}
            {isLoggedIn ? (
                <>
                    <div className={styles.myReviewsList}>
                        {reviews && reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div
                                    key={review.rvIdx}
                                    className={styles.reviewItem}
                                    onClick={() =>
                                        handleItemOnclick(review.rvIdx, review.ramyunIdx)
                                    }
                                >
                                    <div className={styles.reviewContent}>
                                        <div className={styles.recommendCount}>
                                            <FaThumbsUp
                                                className={`thumbs-up-icon ${
                                                    review.isRecommended ? "solid" : "regular"
                                                }`}
                                            />
                                            {review.rvRecommendCount}
                                        </div>
                                        <div className={styles.content}>{review.reviewContent}</div>
                                        <div className={styles.rating}>
                                            {renderStars(review.rate)}
                                        </div>

                                        <div className={styles.date}>
                                            {new Date(review.rvCreatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noReviews}>리뷰가 없습니다.</div>
                        )}
                    </div>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <p>로그인 후 이용해주세요.</p>
            )}
        </div>
    );
};

export default MyReviews;
