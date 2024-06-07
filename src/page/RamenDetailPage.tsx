import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RamenDetail from "../components/RamenDetail/RamenDetail.tsx";
import RamenInfoTable from "../components/RamenDetail/RamenInfoTable.tsx";
import ReviewList from "../components/RamenDetail/ReviewList.tsx";
import ReviewForm from "../components/RamenDetail/ReviewForm.tsx";
import "./RamenDetailPage.scss";
import axios from "axios";

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
    r_scoville: number | null;
}

const RamenDetailPage: React.FC = () => {
    const { idx } = useParams<{ idx: string }>();

    const [ramen, setRamen] = useState<RamenInfo | null>(null);

    useEffect(() => {
        // API 호출 예시
        axios
            .get(`/api/ramyun/${idx}`)
            .then((response) => {
                setRamen(response.data);
            })
            .catch((error) => {
                console.error("라면 정보를 불러오는데 실패했습니다:", error);
            });
    }, [idx]);

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
            <ReviewList />
            <ReviewForm />
        </div>
    );
};

export default RamenDetailPage;
