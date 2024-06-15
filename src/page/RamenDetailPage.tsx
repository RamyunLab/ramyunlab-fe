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
    uIdx: number;
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
}

const RamenDetailPage: React.FC = () => {
    const { ramyunIdx } = useParams<{ ramyunIdx: string }>();
    const [ramen, setRamen] = useState<RamenInfo | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        if (ramyunIdx) {
            axios
                .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}`)
                .then((response) => {
                    const data = response.data.data.ramyun;
                    const mappedRamen: RamenInfo = {
                        r_idx: data.ramyunIdx,
                        r_name: data.ramyunName,
                        r_img: data.ramyunImg,
                        b_name: data.brandName,
                        r_kcal: data.ramyunKcal,
                        r_noodle: data.noodle,
                        r_is_cup: data.isCup,
                        r_cooking: data.cooking,
                        r_gram: data.gram,
                        r_na: data.ramyunNa,
                        r_scoville: data.scoville || undefined,
                        isLiked: response.data.data.isLiked,
                    };
                    setRamen(mappedRamen);
                })
                .catch((error) => {
                    console.error("라면 정보를 불러오는데 실패했습니다:", error);
                });

            axios
                .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}/review`)
                .then((response) => {
                    console.log("axios get:", response.data);
                    const reviewsData = response.data.data.review.content || [];
                    const reviewsWithDefaultValues = reviewsData.map((review: Review) => ({
                        ...review,
                        rvRecommendCount: review.rvRecommendCount ?? 0,
                    }));
                    setReviews(reviewsWithDefaultValues);
                    console.log("setReviews:", reviewsWithDefaultValues);
                })
                .catch((error) => {
                    console.error("리뷰 정보를 불러오는데 실패했습니다:", error);
                    setReviews([]); // 실패 시 빈 배열로 설정
                });
        }
    }, [ramyunIdx]);

    const handleReviewSubmit = (newContent: string, newRating: number, newPhoto: File | null) => {
        // 새로운 리뷰를 등록하는 로직 추가
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

        axios
            .post(`${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                const newReview: Review = {
                    ...response.data.data,
                    rvRecommendCount: response.data.data.rvRecommendCount || 0,
                };
                setReviews((prevReviews) => [newReview, ...prevReviews]);
            })
            .catch((error) => {
                console.error("리뷰 등록 실패:", error);
            });
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
            <div className="average-rating">
                <span>★ ★ ★ ★ ★</span>
            </div>
            {ramyunIdx && (
                <ReviewList reviews={reviews} setReviews={setReviews} ramyunIdx={ramyunIdx} />
            )}
            <ReviewForm
                initialContent=""
                initialRating={3}
                initialPhoto={null}
                onSubmit={handleReviewSubmit}
                onCancel={() => {}}
                isEditMode={false}
            />
        </div>
    );
};

export default RamenDetailPage;
