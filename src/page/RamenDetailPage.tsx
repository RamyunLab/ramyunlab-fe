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

const RamenDetailPage: React.FC = () => {
    const { ramyunIdx } = useParams<{ ramyunIdx: string }>();
    const [ramen, setRamen] = useState<RamenInfo | null>(null);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_SERVER}/main/ramyun/${ramyunIdx}`)
            .then((response) => {
                console.log("Response data:", response.data);
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
                    r_scoville: data.scoville,
                    isLiked: response.data.data.isLiked,
                };
                setRamen(mappedRamen);
            })
            .catch((error) => {
                console.error("라면 정보를 불러오는데 실패했습니다:", error);
            });
    }, [ramyunIdx]);

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
