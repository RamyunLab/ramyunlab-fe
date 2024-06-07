import React, { useState, useEffect } from "react";
import axios from "axios";

interface Review {
    rv_idx: number;
    u_idx: number;
    r_idx: number;
    rv_content: string;
    rv_rate: number;
    rv_created_at: string;
    rv_photo: string | null;
    rv_updated_at: string | null;
    rv_deleted_at: string | null;
    nickname: string;
}

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        // 로그인된 사용자의 ID를 로컬 스토리지에서 가져옴
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedUserInfo.userId);
        }

        // 리뷰 목록을 서버에서 가져옴
        axios
            .get("/api/reviews")
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error("리뷰 목록을 불러오는데 실패했습니다:", error);
            });
    }, []);

    const bestReview =
        reviews.length > 0
            ? reviews.reduce(
                  (prev, current) => (prev.rv_rate > current.rv_rate ? prev : current),
                  reviews[0]
              )
            : null;

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }, (_, i) => (
                    <span key={`full-${i}`} className="star full">
                        ★
                    </span>
                ))}
                {halfStar && <span className="star half">☆</span>}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <span key={`empty-${i}`} className="star empty">
                        ☆
                    </span>
                ))}
            </>
        );
    };

    const handleDelete = (rv_idx: number) => {
        axios
            .delete(`/api/review/${rv_idx}`)
            .then((response) => {
                if (response.data.success) {
                    setReviews(reviews.filter((review) => review.rv_idx !== rv_idx));
                }
            })
            .catch((error) => {
                console.error("리뷰 삭제 실패:", error);
            });
    };

    const handleEdit = (rv_idx: number) => {
        setEditMode(rv_idx);
        const review = reviews.find((review) => review.rv_idx === rv_idx);
        if (review) {
            setEditContent(review.rv_content);
        }
    };

    const handleSave = (rv_idx: number) => {
        axios
            .patch(`/api/review/${rv_idx}`, { rv_content: editContent })
            .then((response) => {
                if (response.data.success) {
                    setReviews(
                        reviews.map((review) =>
                            review.rv_idx === rv_idx
                                ? { ...review, rv_content: editContent }
                                : review
                        )
                    );
                    setEditMode(null);
                    setEditContent("");
                }
            })
            .catch((error) => {
                console.error("리뷰 수정 실패:", error);
            });
    };

    return (
        <div className="review-list">
            {bestReview && (
                <div className="best-review-container">
                    <h2 className="best-review-title">Best Review</h2>
                    <div className="best-review">
                        <div className="nickname">{bestReview.nickname}</div>
                        <div className="review-content">
                            <div className="content">{bestReview.rv_content}</div>
                            <div className="date">{bestReview.rv_created_at}</div>
                        </div>
                        <div className="likes-rating">
                            <div className="rating">{renderStars(bestReview.rv_rate)}</div>
                            <div className="likes">❤️ {bestReview.rv_rate}</div>
                        </div>
                    </div>
                    <div className="divider"></div>
                </div>
            )}
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="nickname">{review.nickname}</div>
                    <div className="review-content">
                        <div className="content">
                            {editMode === review.rv_idx ? (
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            ) : (
                                review.rv_content
                            )}
                        </div>
                        <div className="date">{review.rv_created_at}</div>
                    </div>
                    <div className="likes-rating">
                        <div className="rating">{renderStars(review.rv_rate)}</div>
                        <div className="likes">❤️ {review.rv_rate}</div>
                    </div>
                    {currentUserId === review.u_idx && (
                        <div className="actions">
                            {editMode === review.rv_idx ? (
                                <button onClick={() => handleSave(review.rv_idx)}>저장</button>
                            ) : (
                                <button onClick={() => handleEdit(review.rv_idx)}>수정</button>
                            )}
                            <button onClick={() => handleDelete(review.rv_idx)}>삭제</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
