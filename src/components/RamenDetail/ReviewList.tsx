import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import ReviewForm from "./ReviewForm.tsx";
import ReportModal from "./ReportModal.tsx";
import "./ReviewList.scss";

interface Review {
    rvIdx: number;
    userIdx: number;
    rIdx: number;
    reviewContent: string;
    rate: number;
    rvCreatedAt: string;
    reviewPhotoUrl: string | null;
    rvUpdatedAt: string | null;
    rvDeletedAt: string | null;
    nickname: string;
    recommendIdx: number | null;
    rvRecommendCount: number | null;
    rvReportCount: number;
    isRecommended: boolean;
    rvIsReported: boolean; // 추가된 필드
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
    const [editReportCount, setEditReportCount] = useState<number>(0);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
    const [reportReviewId, setReportReviewId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        const token = localStorage.getItem("token");
        if (userInfo && token) {
            const parsedUserInfo = JSON.parse(userInfo);
            setCurrentUserId(parsedUserInfo.userIdx);
            setIsLoggedIn(true);
        }

        fetchReviews(currentPage);
    }, [ramyunIdx, currentPage]);

    const fetchReviews = (page: number) => {
        const token = localStorage.getItem("token");
        axios
            .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/review`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
                params: {
                    page: page,
                },
            })
            .then((response) => {
                const reviewsData = response.data.data.review.content || [];
                const reviewsWithDefaultValues = reviewsData.map((review: Review) => ({
                    ...review,
                    rvRecommendCount: review.rvRecommendCount ?? 0,
                    rvReportCount: review.rvReportCount ?? 0,
                    rvIsReported: review.rvIsReported ?? false,
                    recommendIdx: review.recommendIdx ?? null, // ensure recommendIdx is set
                }));
                const sortedReviews = sortReviews(reviewsWithDefaultValues);
                setReviews(sortedReviews);
                setTotalPages(response.data.data.review.totalPages);
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
                setReviews([]);
            });
    };

    const sortReviews = (reviews: Review[]) => {
        const bestReviews = reviews
            .filter((review) => review.rvRecommendCount && review.rvRecommendCount >= 10)
            .sort((a, b) => {
                if (b.rvRecommendCount === a.rvRecommendCount) {
                    return new Date(a.rvCreatedAt).getTime() - new Date(b.rvCreatedAt).getTime();
                }
                return (b.rvRecommendCount ?? 0) - (a.rvRecommendCount ?? 0);
            })
            .slice(0, 3);

        const normalReviews = reviews
            .filter((review) => !bestReviews.includes(review))
            .sort((a, b) => new Date(a.rvCreatedAt).getTime() - new Date(b.rvCreatedAt).getTime());

        return [...bestReviews, ...normalReviews];
    };

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

        // 현재 사용자가 해당 리뷰의 작성자인지 확인
        if (currentReview.userIdx === currentUserId) {
            alert("자신의 리뷰에는 좋아요를 클릭할 수 없습니다.");
            return;
        }

        const liked = currentReview.isRecommended;
        const token = localStorage.getItem("token");

        try {
            if (liked) {
                const deleteResponse = await axios.delete(
                    `${process.env.REACT_APP_API_SERVER}/api/recReview/${rvIdx}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                currentReview.recommendIdx = null;
                currentReview.rvRecommendCount = (currentReview.rvRecommendCount || 1) - 1;
                currentReview.isRecommended = false;
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
                currentReview.rvRecommendCount = (currentReview.rvRecommendCount || 0) + 1;
                currentReview.isRecommended = true;
            }

            const updatedReviews = sortReviews(
                reviews.map((review) =>
                    review.rvIdx === rvIdx
                        ? {
                              ...review,
                              rvRecommendCount: currentReview.rvRecommendCount,
                              isRecommended: currentReview.isRecommended,
                              recommendIdx: currentReview.recommendIdx,
                          }
                        : review
                )
            );
            setReviews(updatedReviews);
        } catch (error) {
            console.error(`Failed to ${liked ? "delete" : "add"} like:`, error);
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
                        const updatedReviews = sortReviews(
                            reviews.filter((review) => review.rvIdx !== rvIdx)
                        );
                        setReviews(updatedReviews);
                    }
                })
                .catch((error) => {
                    console.error("Failed to delete review:", error);
                });
        }
    };

    const handleEdit = (
        rvIdx: number,
        content: string,
        rating: number,
        photoUrl: string | null,
        reportCount: number
    ) => {
        setEditMode(rvIdx);
        setEditContent(content);
        setEditRating(rating);
        setEditPhoto(photoUrl);
        setEditReportCount(reportCount);
    };

    const handleCancelEdit = () => {
        setEditMode(null);
    };

    const handleSaveEdit = (
        newContent: string,
        newRating: number,
        newPhoto: File | null,
        reportCount: number
    ) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        if (newPhoto) {
            formData.append("file", newPhoto);
        }

        const body = JSON.stringify({
            reviewContent: newContent,
            rate: newRating,
            rvReportCount: reportCount,
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
                        fetchReviews(currentPage);
                    }
                })
                .catch((error) => {
                    console.error("Failed to save edited review:", error);
                });
        }
    };

    const openReportModal = (rvIdx: number) => {
        setReportReviewId(rvIdx);
        setIsReportModalOpen(true);
    };

    const handleReportSubmit = (reportReason: string) => {
        if (reportReviewId !== null) {
            const token = localStorage.getItem("token");

            const reportDTO = {
                reportReason: reportReason,
            };

            axios
                .post(
                    `${process.env.REACT_APP_API_SERVER}/api/complaint/${reportReviewId}`,
                    reportDTO,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((response) => {
                    setIsReportModalOpen(false);
                    fetchReviews(currentPage);
                })
                .catch((error) => {
                    console.error("Failed to submit report:", error);
                    if (error.response.data.error === "이미 신고한 리뷰입니다.") {
                        alert("이미 신고한 리뷰입니다");
                    }
                });
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchReviews(newPage);
        }
    };

    if (!reviews) {
        return <div>Loading...</div>;
    }

    return (
        <div className="review-list">
            {reviews.map((review, index) => {
                return (
                    <div
                        className={`review ${
                            review.rvRecommendCount && review.rvRecommendCount >= 10
                                ? "best-review"
                                : ""
                        }`}
                        key={index}
                    >
                        {editMode === review.rvIdx ? (
                            <ReviewForm
                                initialContent={editContent}
                                initialRating={editRating}
                                initialPhoto={editPhoto}
                                rvReportCount={editReportCount}
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
                                    {review.rvIsReported ? (
                                        <div className="blind">블라인드 처리된 댓글입니다.</div>
                                    ) : (
                                        <>
                                            {review.reviewPhotoUrl && (
                                                <div className="review-image">
                                                    <img src={review.reviewPhotoUrl} alt="Review" />
                                                </div>
                                            )}
                                            <div className="content">{review.reviewContent}</div>
                                        </>
                                    )}
                                    <div className="date">
                                        {new Date(review.rvCreatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="likes-rating">
                                    <div className="rating">{renderStars(review.rate)}</div>
                                    <div className="likes">
                                        <FontAwesomeIcon
                                            icon={
                                                review.isRecommended
                                                    ? solidThumbsUp
                                                    : regularThumbsUp
                                            }
                                            onClick={() => handleLikeToggle(review.rvIdx)}
                                            className={`thumbs-up-icon ${
                                                review.isRecommended ? "solid" : "regular"
                                            }`}
                                        />
                                        {review.rvRecommendCount ?? 0}
                                    </div>
                                    {currentUserId === review.userIdx && (
                                        <div className="actions">
                                            <button
                                                onClick={() =>
                                                    handleEdit(
                                                        review.rvIdx,
                                                        review.reviewContent,
                                                        review.rate,
                                                        review.reviewPhotoUrl,
                                                        review.rvReportCount ?? 0
                                                    )
                                                }
                                            >
                                                수정
                                            </button>
                                            <button onClick={() => handleDelete(review.rvIdx)}>
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isLoggedIn && currentUserId !== review.userIdx && (
                                    <div className="report">
                                        <button onClick={() => openReportModal(review.rvIdx)}>
                                            신고하기
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    이전
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음
                </button>
            </div>
            {isReportModalOpen && (
                <ReportModal
                    onSubmit={handleReportSubmit}
                    onCancel={() => setIsReportModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ReviewList;
