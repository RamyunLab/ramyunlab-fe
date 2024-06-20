import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import ReviewForm from "./ReviewForm.tsx";
import ReportModal from "./ReportModal.tsx";
import Pagination from "../Pagination/Pagination.tsx";
import "./ReviewList.scss";
import { useLocation, useNavigate } from "react-router-dom";

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
    rvIsReported: boolean;
}

interface ReviewListProps {
    reviews: Review[];
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
    ramyunIdx: string;
    isBestReviewList?: boolean;
    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
}

const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    setReviews,
    ramyunIdx,
    isBestReviewList = false,
    currentPage,
    totalPages,
    setCurrentPage,
    setTotalPages,
}) => {
    const [editMode, setEditMode] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [editRating, setEditRating] = useState<number>(0);
    const [editPhoto, setEditPhoto] = useState<string | null>(null);
    const [editReportCount, setEditReportCount] = useState<number>(0);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
    const [reportReviewId, setReportReviewId] = useState<number | null>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
    const [reviewNo, setReviewNo] = useState<number | null>(null);
    const location = useLocation();
    const scrollRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        const token = localStorage.getItem("token");
        console.log("Local Storage userInfo:", userInfo);
        console.log("Local Storage token:", token);
        if (userInfo && token) {
            const parsedUserInfo = JSON.parse(userInfo);
            console.log("Parsed userInfo:", parsedUserInfo);
            setCurrentUserId(parsedUserInfo.userIdx);
            console.log("userIdx: ", parsedUserInfo.userIdx);
            setIsLoggedIn(true);
        }
        fetchReviews(currentPage);
    }, [ramyunIdx, currentPage]);

    const fetchReviews = (page: number) => {
        const token = localStorage.getItem("token");
        console.log(`Fetching reviews for ramyunIdx: ${ramyunIdx} on page: ${page}`);
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
                console.log("Reviews response from server:", response.data);
                const reviewsData = response.data.data.review.content || [];
                const reviewsWithDefaultValues = reviewsData.map((review: Review) => ({
                    ...review,
                    rvRecommendCount: review.rvRecommendCount ?? 0,
                    rvReportCount: review.rvReportCount ?? 0,
                    rvIsReported: review.rvIsReported ?? false,
                    recommendIdx: review.recommendIdx ?? null,
                }));
                setReviews(reviewsWithDefaultValues);
                setTotalPages(response.data.data.review.totalPages);
                console.log("Set reviews:", reviewsWithDefaultValues);
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
                setReviews([]); // 실패 시 빈 배열로 설정
            });
    };

    useEffect(() => {
        // 라면 변경 시
        const path = location.pathname.split("/").reverse()[0];
        if (path === "review") {
            const page = new URLSearchParams(location.search).get("page");
            const reviewNo = new URLSearchParams(location.search).get("reviewNo");
            setCurrentPage(parseInt(page));
            setReviewNo(parseInt(reviewNo));
            if (scrollRef) {
                console.log("scrollRef 존재함!!!");
            }
            scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            fetchReviews(currentPage);
        }
    }, [ramyunIdx]);

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
                console.log("Delete like response:", deleteResponse.data);
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
                console.log("Add like response:", response.data);
                currentReview.recommendIdx = response.data.data.recommendIdx;
                currentReview.rvRecommendCount = (currentReview.rvRecommendCount || 0) + 1;
                currentReview.isRecommended = true;
            }

            const updatedReviews = reviews.map((review) =>
                review.rvIdx === rvIdx
                    ? {
                          ...review,
                          rvRecommendCount: currentReview.rvRecommendCount,
                          isRecommended: currentReview.isRecommended,
                      }
                    : review
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
                    console.log("Delete review response:", response.data);
                    if (response.data.statusCode === 200) {
                        const updatedReviews = reviews.filter((review) => review.rvIdx !== rvIdx);
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

        console.log("Saving edited review:", { newContent, newRating, newPhoto, reportCount });
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
                    console.log("Edit review response:", response.data);
                    if (response.data.statusCode === 200) {
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
                                          rvRecommendCount:
                                              response.data.data.rvRecommendCount ?? 0,
                                          rvReportCount: reportCount,
                                          isRecommended: response.data.data.isRecommended,
                                      }
                                    : review
                            )
                        );
                        setEditMode(null);
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

    const handleReportSubmit = async (reportReason: string) => {
        if (reportReviewId !== null) {
            const token = localStorage.getItem("token");

            const reportDTO = {
                reportReason: reportReason,
            };

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_SERVER}/api/complaint/${reportReviewId}`,
                    reportDTO,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setIsReportModalOpen(false);
                fetchReviews(currentPage);
                return true; // 신고 성공
            } catch (error) {
                console.error("Failed to submit report:", error);
                if (error.response.data.error === "이미 신고한 리뷰입니다.") {
                    alert("이미 신고한 리뷰입니다");
                }
                return false; // 신고 실패 또는 이미 신고된 리뷰
            }
        }
        return false;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openImageModal = (imageUrl: string | null) => {
        setSelectedImageUrl(imageUrl);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImageUrl(null);
    };

    const handleClickOutsideModal = (event: MouseEvent) => {
        if (event.target instanceof Node && event.target.closest(".image-modal-content") === null) {
            closeImageModal();
        }
    };

    useEffect(() => {
        if (isImageModalOpen) {
            document.addEventListener("mousedown", handleClickOutsideModal);
        } else {
            document.removeEventListener("mousedown", handleClickOutsideModal);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideModal);
        };
    }, [isImageModalOpen]);

    if (!reviews) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`review-list ${isBestReviewList ? "best-review-list" : ""}`}>
            {isBestReviewList && <h2>베스트 리뷰</h2>}
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
                            <div
                                key={review.rvIdx}
                                className={review.rvIdx == reviewNo ? "review-highlight" : ""}
                            >
                                <div className="nickname">{review.nickname}</div>
                                <div className="review-content">
                                    {review.rvIsReported ? (
                                        <div className="blind">블라인드 처리 된 댓글입니다.</div>
                                    ) : (
                                        <>
                                            {review.reviewContent ? (
                                                <div className="content">
                                                    {review.reviewContent
                                                        .split("\n")
                                                        .map((line, index) => (
                                                            <React.Fragment key={index}>
                                                                {line}
                                                                <br />
                                                            </React.Fragment>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="content empty">
                                                    리뷰 내용이 없습니다.
                                                </div>
                                            )}
                                            {review.reviewPhotoUrl && (
                                                <div className="review-image">
                                                    <img
                                                        src={review.reviewPhotoUrl}
                                                        alt="Review"
                                                        onClick={() =>
                                                            openImageModal(review.reviewPhotoUrl)
                                                        }
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
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
                                </div>
                                <div className="review-actions">
                                    {currentUserId === review.userIdx && (
                                        <>
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
                                        </>
                                    )}
                                    {isLoggedIn && currentUserId !== review.userIdx && (
                                        <div className="report">
                                            <button onClick={() => openReportModal(review.rvIdx)}>
                                                신고
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="date">
                                    {new Date(review.rvCreatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            {!isBestReviewList && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            {isReportModalOpen && (
                <ReportModal
                    onSubmit={handleReportSubmit}
                    onCancel={() => setIsReportModalOpen(false)}
                />
            )}
            {isImageModalOpen && selectedImageUrl && (
                <div className="image-modal">
                    <div className="image-modal-content">
                        <span className="close" onClick={closeImageModal}>
                            &times;
                        </span>
                        <img src={selectedImageUrl} alt="Enlarged Review" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
