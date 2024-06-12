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
    liked: boolean;
    recommendIdx: number | null;
}

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [bestReviews, setBestReviews] = useState<Review[]>([]);
    const ramyunIdx = 1; // 라면 인덱스를 상수로 설정

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        const token = localStorage.getItem("token");
        if (userInfo && token) {
            const parsedUserInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedUserInfo.userIdx); // userIdx로 설정
            setIsLoggedIn(true);
        }

        const tempReviews: Review[] = [
            {
                rv_idx: 1,
                u_idx: 1,
                r_idx: 1,
                rv_content: "이 라면 정말 맛있어요!",
                rv_rate: 5,
                rv_created_at: "2023-06-01",
                rv_photo: "https://via.placeholder.com/150", // 임시 이미지 URL
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "test123",
                liked: false,
                recommendIdx: 5,
            },
            {
                rv_idx: 2,
                u_idx: 2,
                r_idx: 1,
                rv_content: "매운 맛이 정말 좋아요!",
                rv_rate: 4,
                rv_created_at: "2023-06-02",
                rv_photo: "https://via.placeholder.com/150", // 임시 이미지 URL
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "사용자2",
                liked: false,
                recommendIdx: 3,
            },
            {
                rv_idx: 3,
                u_idx: 3,
                r_idx: 1,
                rv_content: "가격 대비 괜찮아요.",
                rv_rate: 3,
                rv_created_at: "2023-06-03",
                rv_photo: null,
                rv_updated_at: null,
                rv_deleted_at: null,
                nickname: "사용자3",
                liked: false,
                recommendIdx: 5,
            },
        ];
        setReviews(tempReviews);
    }, []);

    useEffect(() => {
        if (reviews.length > 0) {
            const sortedReviews = [...reviews].sort((a, b) => {
                if ((b.recommendIdx !== null ? 1 : 0) - (a.recommendIdx !== null ? 1 : 0) !== 0) {
                    return (b.recommendIdx !== null ? 1 : 0) - (a.recommendIdx !== null ? 1 : 0);
                }
                return new Date(a.rv_created_at).getTime() - new Date(b.rv_created_at).getTime();
            });
            setBestReviews(sortedReviews.slice(0, 3));
        }
    }, [reviews]);

    const handleLikeToggle = async (rvIdx: number) => {
        if (!isLoggedIn) {
            alert("로그인 후 이용해주세요.");
            return;
        }

        const currentReview = reviews.find((review) => review.rv_idx === rvIdx);
        if (!currentReview) return;

        const liked = currentReview.liked;
        const token = localStorage.getItem("token");

        try {
            if (liked) {
                console.log("토큰 확인", token);
                await axios.delete(
                    `${process.env.REACT_APP_API_SERVER}/api/recReview/${currentReview.recommendIdx}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                currentReview.recommendIdx = null;
            } else {
                console.log("토큰 확인", token);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_SERVER}/api/recReview/${rvIdx}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                currentReview.recommendIdx = response.data.data.recommendIdx;
            }

            const updatedReviews = reviews.map((review) =>
                review.rv_idx === rvIdx ? { ...review, liked: !liked } : review
            );
            setReviews(updatedReviews);
        } catch (error) {
            console.error(`좋아요 ${liked ? "삭제" : "추가"} 실패:`, error);
        }
    };

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

    const handleDelete = (rvIdx: number) => {
        const token = localStorage.getItem("token");
        axios
            .delete(`${process.env.REACT_APP_API_SERVER}/api/review/${rvIdx}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.success) {
                    setReviews(reviews.filter((review) => review.rv_idx !== rvIdx));
                }
            })
            .catch((error) => {
                console.error("리뷰 삭제 실패:", error);
            });
    };

    const handleEdit = (rvIdx: number) => {
        setEditMode(rvIdx);
        const review = reviews.find((review) => review.rv_idx === rvIdx);
        if (review) {
            setEditContent(review.rv_content);
        }
    };

    const handleSave = (rvIdx: number) => {
        const token = localStorage.getItem("token");
        axios
            .patch(
                `${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}/${rvIdx}`,
                { rv_content: editContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                if (response.data.success) {
                    setReviews(
                        reviews.map((review) =>
                            review.rv_idx === rvIdx
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
            {bestReviews.length > 0 && (
                <div className="best-review-container">
                    <div className="best-review-title">베스트 리뷰</div>
                    {bestReviews.map((bestReview, index) => (
                        <div key={index} className="best-review">
                            <div className="nickname">{bestReview.nickname}</div>
                            <div className="review-content">
                                {bestReview.rv_photo && (
                                    <div className="review-image">
                                        <img src={bestReview.rv_photo} alt="Review" />
                                    </div>
                                )}
                                <div className="content">{bestReview.rv_content}</div>
                                <div className="date">{bestReview.rv_created_at}</div>
                            </div>
                            <div className="likes-rating">
                                <div className="rating">{renderStars(bestReview.rv_rate)}</div>
                                <div className="likes">
                                    <FontAwesomeIcon
                                        icon={bestReview.liked ? solidThumbsUp : regularThumbsUp}
                                        onClick={() => handleLikeToggle(bestReview.rv_idx)}
                                        className={`thumbs-up-icon ${
                                            bestReview.liked ? "solid" : "regular"
                                        }`}
                                    />
                                    {bestReview.rv_rate}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="divider"></div>
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="nickname">{review.nickname}</div>
                    <div className="review-content">
                        {review.rv_photo && (
                            <div className="review-image">
                                <img src={review.rv_photo} alt="Review" />
                            </div>
                        )}
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
                                className={`thumbs-up-icon ${review.liked ? "solid" : "regular"}`}
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
