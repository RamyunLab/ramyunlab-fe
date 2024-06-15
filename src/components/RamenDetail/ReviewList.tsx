import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import ReviewForm from "./ReviewForm.tsx";

interface Review {
    rvIdx: number;
    uIdx: number;
    rIdx: number;
    reviewContent: string;
    rate: number;
    rvCreatedAt: string;
    reviewPhotoUrl: string | null;
    rvUpdatedAt: string | null;
    rvDeletedAt: string | null;
    nickname: string;
    liked: boolean;
    recommendIdx: number | null;
}

interface ReviewListProps {
    reviews: Review[];
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
    ramyunIdx: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, setReviews, ramyunIdx }) => {
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [editRating, setEditRating] = useState<number>(0);
    const [editPhoto, setEditPhoto] = useState<string | null>(null);
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

        axios
            .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/review`)
            .then((response) => {
                console.log("Reviews response from server:", response.data);
                const reviewsData = response.data.data.review.content || [];
                setReviews(reviewsData);
                console.log("Reviews data:", reviewsData);
            })
            .catch((error) => {
                console.error("리뷰 정보를 불러오는데 실패했습니다:", error);
                setReviews([]); // 실패 시 빈 배열로 설정
            });
    }, [ramyunIdx, setReviews]);

    useEffect(() => {
        console.log("Updated reviews state:", reviews);
    }, [reviews]);

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
        const confirmed = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
        if (confirmed) {
            const token = localStorage.getItem("token");
            axios
                .delete(`${process.env.REACT_APP_API_SERVER}/api/review/${rvIdx}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.statusCode === 200) {
                        setReviews((prevReviews) =>
                            prevReviews.filter((review) => review.rvIdx !== rvIdx)
                        );
                    }
                })
                .catch((error) => {
                    console.error("리뷰 삭제 실패:", error);
                });
        }
    };

    const handleEdit = (
        rvIdx: number,
        content: string,
        rating: number,
        photoUrl: string | null
    ) => {
        setEditMode(rvIdx);
        setEditContent(content);
        setEditRating(rating);
        setEditPhoto(photoUrl);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
    };

    const handleSaveEdit = (newContent: string, newRating: number, newPhoto: File | null) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        if (newPhoto) {
            formData.append("file", newPhoto);
        }

        const body = JSON.stringify({
            reviewContent: newContent,
            rate: newRating,
        });
        const blob = new Blob([body], {
            type: "application/json",
        });
        formData.append("reviewDTO", blob);

        if (editMode && ramyunIdx) {
            axios
                .patch(
                    `${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}/${editMode}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
                .then((response) => {
                    if (response.data.statusCode === 200) {
                        console.log("Response from server:", response.data);
                        setReviews((prevReviews) =>
                            prevReviews.map((review) =>
                                review.rvIdx === editMode
                                    ? {
                                          ...review,
                                          reviewContent: newContent,
                                          rate: newRating,
                                          reviewPhotoUrl:
                                              response.data.data.reviewPhotoUrl ||
                                              review.reviewPhotoUrl,
                                      }
                                    : review
                            )
                        );
                        setEditMode(null);
                    }
                })
                .catch((error) => {
                    console.error("리뷰 수정 실패:", error);
                });
        }
    };

    if (!reviews) {
        return <div>Loading...</div>;
    }

    return (
        <div className="review-list">
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    {editMode === review.rvIdx ? (
                        <ReviewForm
                            initialContent={editContent}
                            initialRating={editRating}
                            initialPhoto={editPhoto}
                            onSubmit={handleSaveEdit}
                            onCancel={handleCancelEdit}
                            isEditMode={true}
                            rvIdx={review.rvIdx}
                            ramyunIdx={ramyunIdx}
                        />
                    ) : (
                        <>
                            <div className="nickname">{review.nickname}</div>
                            <div className="review-content">
                                {review.reviewPhotoUrl && (
                                    <div className="review-image">
                                        <img src={review.reviewPhotoUrl} alt="Review" />
                                    </div>
                                )}
                                <div className="content">{review.reviewContent}</div>
                                <div className="date">
                                    {new Date(review.rvCreatedAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="likes-rating">
                                <div className="rating">{renderStars(review.rate)}</div>
                                <div className="likes">
                                    <FontAwesomeIcon
                                        icon={review.liked ? solidThumbsUp : regularThumbsUp}
                                        onClick={() => handleLikeToggle(review.rvIdx)}
                                        className={`thumbs-up-icon ${
                                            review.liked ? "solid" : "regular"
                                        }`}
                                    />
                                    {review.rate}
                                </div>
                            </div>
                            {currentUserId === review.uIdx && (
                                <div className="actions">
                                    <button
                                        onClick={() =>
                                            handleEdit(
                                                review.rvIdx,
                                                review.reviewContent,
                                                review.rate,
                                                review.reviewPhotoUrl
                                            )
                                        }
                                    >
                                        수정
                                    </button>
                                    <button onClick={() => handleDelete(review.rvIdx)}>삭제</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
