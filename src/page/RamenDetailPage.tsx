import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RamenDetail from "../components/RamenDetail/RamenDetail.tsx";
import RamenInfoTable from "../components/RamenDetail/RamenInfoTable.tsx";
import ReviewList from "../components/RamenDetail/ReviewList.tsx";
import ReviewForm from "../components/RamenDetail/ReviewForm.tsx";
import "./RamenDetailPage.scss";

interface RamenInfo {
    r_idx: number;
    r_name: string;
    r_img: string | null;
    b_name: string;
    r_kcal: number;
    r_noodle: boolean;
    r_is_cup: boolean;
    r_cooking: boolean;
    r_gram: number;
    r_na: number;
    r_scoville?: number;
    isLiked: boolean;
    avgRate: number;
}

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

const RamenDetailPage: React.FC = () => {
    const { ramyunIdx } = useParams<{ ramyunIdx: string }>();
    const [ramen, setRamen] = useState<RamenInfo | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [bestReviews, setBestReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        if (ramyunIdx) {
            const token = localStorage.getItem("token");

            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const fetchRamenDetails = axios.get(
                `${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}`,
                {
                    headers,
                }
            );

            const fetchReviews = axios.get(
                `${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/review`,
                {
                    headers,
                    params: {
                        page: currentPage,
                    },
                }
            );

            Promise.all([fetchRamenDetails, fetchReviews])
                .then(([ramenResponse, reviewsResponse]) => {
                    console.log("Ramen details response:", ramenResponse);
                    console.log("Reviews response:", reviewsResponse);

                    const ramenData = ramenResponse.data.data.ramyun;
                    const mappedRamen: RamenInfo = {
                        r_idx: ramenData.ramyunIdx,
                        r_name: ramenData.ramyunName,
                        r_img: ramenData.ramyunImg,
                        b_name: ramenData.brandName,
                        r_kcal: ramenData.ramyunKcal,
                        r_noodle: ramenData.noodle,
                        r_is_cup: ramenData.isCup,
                        r_cooking: ramenData.cooking,
                        r_gram: ramenData.gram,
                        r_na: ramenData.ramyunNa,
                        r_scoville: ramenData.scoville || undefined,
                        isLiked: ramenResponse.data.data.isLiked,
                        avgRate: ramenData.avgRate,
                    };
                    setRamen(mappedRamen);

                    const reviewsData = reviewsResponse.data.data.review.content || [];
                    const reviewsWithDefaultValues = reviewsData.map((review: Review) => ({
                        ...review,
                        rvRecommendCount: review.rvRecommendCount ?? 0,
                        rvReportCount: review.rvReportCount ?? 0,
                    }));
                    setReviews(reviewsWithDefaultValues);
                    setTotalPages(reviewsResponse.data.data.review.totalPages);

                    const bestReviewsData = ramenResponse.data.data.bestReview || [];
                    const bestReviewsWithDefaultValues = bestReviewsData.map((review: Review) => ({
                        ...review,
                        rvRecommendCount: review.rvRecommendCount ?? 0,
                        rvReportCount: review.rvReportCount ?? 0,
                    }));
                    setBestReviews(bestReviewsWithDefaultValues);
                })
                .catch((error) => {
                    console.error("Failed to fetch data:", error);
                    console.error(
                        "Error details:",
                        error.response ? error.response.data : error.message
                    );
                });
        }
    }, [ramyunIdx, currentPage]);

    const handleReviewSubmit = (newContent: string, newRating: number, newPhoto: File | null) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        if (newPhoto) {
            formData.append("file", newPhoto);
        }

        const body = JSON.stringify({
            reviewContent: newContent,
            rate: newRating,
            rvReportCount: 0,
        });
        const blob = new Blob([body], {
            type: "application/json",
        });
        formData.append("reviewDTO", blob);

        console.log("Submitting new review:", { newContent, newRating, newPhoto });
        axios
            .post(`${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Review submission response:", response);
                const newReview: Review = {
                    ...response.data.data,
                    rvRecommendCount: response.data.data.rvRecommendCount || 0,
                    rvReportCount: response.data.data.rvReportCount || 0,
                };
                setReviews((prevReviews) => [...prevReviews, newReview]);
                updateAvgRate(newRating);

                // 페이지네이션 업데이트
                const newTotalPages = Math.ceil((reviews.length + 1) / 5);
                setTotalPages(newTotalPages);

                // 만약 새로운 페이지가 생겼다면 그 페이지로 이동
                if (currentPage < newTotalPages) {
                    setCurrentPage(newTotalPages);
                }
            })
            .catch((error) => {
                console.error("Failed to submit review:", error);
                console.error(
                    "Error details:",
                    error.response ? error.response.data : error.message
                );
                if (error.response.data.error === "이미 리뷰를 작성하셨습니다.") {
                    alert("이미 리뷰를 작성하셨습니다.");
                }
            });
    };

    const updateAvgRate = (newRating: number) => {
        if (ramen) {
            const totalReviews = reviews.length + 1;
            const totalRating = ramen.avgRate * reviews.length + newRating;
            const newAvgRate = totalRating / totalReviews;
            setRamen((prevRamen) =>
                prevRamen ? { ...prevRamen, avgRate: newAvgRate } : prevRamen
            );
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (!ramen) {
        return <div>Loading...</div>;
    }

    return (
        <div className="ramen-detail-page">
            <div className="ramen-info-container">
                <RamenDetail image={ramen.r_img} avgRate={ramen.avgRate} />
                <RamenInfoTable ramen={ramen} />
            </div>
            <div className="average-rating">{/* <span>★ ★ ★ ★ ★</span> */}</div>
            {ramyunIdx && (
                <>
                    <ReviewList
                        reviews={bestReviews}
                        setReviews={setReviews}
                        ramyunIdx={ramyunIdx}
                        isBestReviewList={true}
                    />
                    <ReviewList reviews={reviews} setReviews={setReviews} ramyunIdx={ramyunIdx} />
                </>
            )}
            <ReviewForm
                initialContent=""
                initialRating={3}
                initialPhoto={null}
                rvReportCount={0}
                onSubmit={handleReviewSubmit}
                onCancel={() => {}}
                isEditMode={false}
            />
        </div>
    );
};

export default RamenDetailPage;
