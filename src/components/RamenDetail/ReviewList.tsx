import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";

interface Review {
    rvIdx: number;
    uIdx: number;
    rIdx: number;
    rvContent: string;
    rvRate: number;
    rvCreatedAt: string;
    rvPhoto: string | null;
    rvUpdatedAt: string | null;
    rvDeletedAt: string | null;
    nickname: string;
    liked: boolean;
    recommendIdx: number | null;
}

interface ReviewListProps {
    reviews: Review[];
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, setReviews }) => {
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        const token = localStorage.getItem("token");
        if (userInfo && token) {
            const parsedUserInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedUserInfo.userIdx);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLikeToggle = async (rvIdx: number) => {
        if (!isLoggedIn) {
            alert("로그인 후 이용해주세요.");
            return;
        }

        const currentReview = reviews.find((review) => review.rvIdx === rvIdx);
        if (!currentReview) return;

        const liked = currentReview.liked;
        const token = localStorage.getItem("token");

        try {
            if (liked) {
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
                review.rvIdx === rvIdx ? { ...review, liked: !liked } : review
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
                    setReviews(reviews.filter((review) => review.rvIdx !== rvIdx));
                }
            })
            .catch((error) => {
                console.error("리뷰 삭제 실패:", error);
            });
    };

    const handleEdit = (rvIdx: number) => {
        setEditMode(rvIdx);
        const review = reviews.find((review) => review.rvIdx === rvIdx);
        if (review) {
            setEditContent(review.rvContent);
        }
    };

    const handleSave = (rvIdx: number) => {
        const token = localStorage.getItem("token");
        axios
            .patch(
                `${process.env.REACT_APP_API_SERVER}/api/review/${rvIdx}`,
                { reviewContent: editContent },
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
                            review.rvIdx === rvIdx ? { ...review, rvContent: editContent } : review
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
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="nickname">{review.nickname}</div>
                    <div className="review-content">
                        {review.rvPhoto && (
                            <div className="review-image">
                                <img src={review.rvPhoto} alt="Review" />
                            </div>
                        )}
                        <div className="content">
                            {editMode === review.rvIdx ? (
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            ) : (
                                review.rvContent
                            )}
                        </div>
                        <div className="date">{review.rvCreatedAt}</div>
                    </div>
                    <div className="likes-rating">
                        <div className="rating">{renderStars(review.rvRate)}</div>
                        <div className="likes">
                            <FontAwesomeIcon
                                icon={review.liked ? solidThumbsUp : regularThumbsUp}
                                onClick={() => handleLikeToggle(review.rvIdx)}
                                className={`thumbs-up-icon ${review.liked ? "solid" : "regular"}`}
                            />
                            {review.rvRate}
                        </div>
                    </div>
                    {currentUserId === review.uIdx && (
                        <div className="actions">
                            {editMode === review.rvIdx ? (
                                <button onClick={() => handleSave(review.rvIdx)}>저장</button>
                            ) : (
                                <button onClick={() => handleEdit(review.rvIdx)}>수정</button>
                            )}
                            <button onClick={() => handleDelete(review.rvIdx)}>삭제</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
