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
    rvIsReported: boolean; // 추가된 필드
}

const RamenDetailPage: React.FC = () => {
    const { ramyunIdx } = useParams<{ ramyunIdx: string }>();
    const [ramen, setRamen] = useState<RamenInfo | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    useEffect(() => {
        if (ramyunIdx) {
            fetchRamenDetails();
            fetchReviews(currentPage);
        }
    }, [ramyunIdx, currentPage]);

    const fetchRamenDetails = () => {
        const token = localStorage.getItem("token");

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios
            .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}`, { headers })
            .then((response) => {
                const ramenData = response.data.data.ramyun;
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
                    isLiked: response.data.data.isLiked,
                };
                setRamen(mappedRamen);
            })
            .catch((error) => {
                console.error("Failed to fetch ramen details:", error);
            });
    };

    const fetchReviews = (page: number) => {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios
            .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/review`, {
                headers,
                params: { page },
            })
            .then((response) => {
                const reviewsData = response.data.data.review.content || [];
                const reviewsWithDefaultValues = reviewsData.map((review: Review) => ({
                    ...review,
                    rvRecommendCount: review.rvRecommendCount ?? 0,
                    rvReportCount: review.rvReportCount ?? 0,
                    rvIsReported: review.rvIsReported ?? false,
                }));
                setReviews(reviewsWithDefaultValues);
                setTotalPages(response.data.data.review.totalPages);
            })
            .catch((error) => {
                console.error("Failed to fetch reviews:", error);
            });
    };

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
        const blob = new Blob([body], { type: "application/json" });
        formData.append("reviewDTO", blob);

        axios
            .post(`${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setTotalPages((prevTotalPages) => {
                    const newTotalPages = prevTotalPages + 1;
                    setCurrentPage(newTotalPages);
                    fetchReviews(newTotalPages);
                    return newTotalPages;
                });
            })
            .catch((error) => {
                console.error("Failed to submit review:", error);
            });
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
                <RamenDetail image={ramen.r_img} />
                <RamenInfoTable ramen={ramen} />
            </div>

<!--             <div className="average-rating">{/* <span>★ ★ ★ ★ ★</span> */}</div> -->

            {ramyunIdx && (
                <ReviewList reviews={reviews} setReviews={setReviews} ramyunIdx={ramyunIdx} />
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
