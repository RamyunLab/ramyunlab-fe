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
    r_scoville: number | null;
}

const RamenDetailPage: React.FC = () => {
    const { idx } = useParams<{ idx: string }>();

    const [ramen, setRamen] = useState<RamenInfo | null>(null);

    useEffect(() => {
        // 임시 데이터 설정
        const tempRamen: RamenInfo = {
            r_idx: 1,
            r_name: "감자면",
            r_img: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_감자면.jpg",
            b_name: "농심",
            r_kcal: 525,
            r_noodle: true,
            r_is_cup: false,
            r_cooking: true,
            r_gram: 117,
            r_na: 1750,
            r_scoville: null,
        };
        setRamen(tempRamen);

        // 실제 API 호출 부분 (주석 처리)
        /*
        axios.get(`/api/ramyun/${idx}`)
            .then(response => {
                setRamen(response.data);
            })
            .catch(error => {
                console.error("라면 정보를 불러오는데 실패했습니다:", error);
            });
        */
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
