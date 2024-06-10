import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";

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
    liked: boolean; // 추가: 좋아요 상태
}

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedUserInfo.userId);
        }

        const tempReviews: Review[] = [
            {
                rv_idx: 1,
                u_idx: 1,
                r_idx: 1,
                rv_content: "이 라면 정말 맛있어요!",
                rv_rate: 5,
                rv_created_at: "2023-06-01",
                rv_photo: null,
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "사용자1",
                liked: false,
            },
            {
                rv_idx: 2,
                u_idx: 2,
                r_idx: 1,
                rv_content: "매운 맛이 정말 좋아요!",
                rv_rate: 4,
                rv_created_at: "2023-06-02",
                rv_photo: null,
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "사용자2",
                liked: false,
            },
            {
                rv_idx: 3,
                u_idx: 1,
                r_idx: 1,
                rv_content: "가격 대비 괜찮아요.",
                rv_rate: 3,
                rv_created_at: "2023-06-03",
                rv_photo: null,
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "사용자1",
                liked: false,
            },
        ];
        setReviews(tempReviews);

        // 실제 API 호출 (주석 처리)
        /*
        axios
            .get(`${process.env.REACT_APP_API_SERVER}/api/reviews`)
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error("리뷰 목록을 불러오는데 실패했습니다:", error);
            });
        */
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
            .delete(`${process.env.REACT_APP_API_SERVER}/api/review/${rv_idx}`)
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
            .patch(`${process.env.REACT_APP_API_SERVER}/api/review/${rv_idx}`, {
                rv_content: editContent,
            })
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

    const handleLikeToggle = (rv_idx: number) => {
        const review = reviews.find((r) => r.rv_idx === rv_idx);
        if (!review) return;

        if (review.liked) {
            axios
                .delete(`${process.env.REACT_APP_API_SERVER}/api/recommend/${rv_idx}`)
                .then((response) => {
                    if (response.data.success) {
                        setReviews(
                            reviews.map((r) => (r.rv_idx === rv_idx ? { ...r, liked: false } : r))
                        );
                    }
                })
                .catch((error) => {
                    console.error("공감 삭제 실패:", error);
                });
        } else {
            axios
                .post(`${process.env.REACT_APP_API_SERVER}/api/recommend/${rv_idx}`)
                .then((response) => {
                    if (response.data.success) {
                        setReviews(
                            reviews.map((r) => (r.rv_idx === rv_idx ? { ...r, liked: true } : r))
                        );
                    }
                })
                .catch((error) => {
                    console.error("공감 추가 실패:", error);
                });
        }
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
                            <div className="likes">
                                <FontAwesomeIcon
                                    icon={bestReview.liked ? solidThumbsUp : regularThumbsUp}
                                    onClick={() => handleLikeToggle(bestReview.rv_idx)}
                                    className="thumbs-up-icon"
                                />
                                {bestReview.rv_rate}
                            </div>
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
                        <div className="likes">
                            <FontAwesomeIcon
                                icon={review.liked ? solidThumbsUp : regularThumbsUp}
                                onClick={() => handleLikeToggle(review.rv_idx)}
                                className="thumbs-up-icon"
                            />
                            {review.rv_rate}
                        </div>
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
