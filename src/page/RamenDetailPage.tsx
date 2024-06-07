import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RamenDetailPage.scss";
import RamenDetail from "../components/RamenDetail/RamenDetail.tsx";
import RamenInfoTable from "../components/RamenDetail/RamenInfoTable.tsx";
import ReviewList from "../components/RamenDetail/ReviewList.tsx";
import ReviewForm from "../components/RamenDetail/ReviewForm.tsx";

const RamenDetailPage: React.FC = () => {
    const { idx } = useParams<{ idx: string }>();

    const [ramen] = useState({
        image: "/path/to/image.png",
        name: "라면 이름",
        brand: "오뚜기",
        weight: "1,000g",
        cookingMethod: "국물 라면",
        noodleType: "건면",
        calories: "500kcal",
        sodium: "200mg",
        scoville: "5,000",
    });

    useEffect(() => {
        console.log("Ramen data:", ramen);
    }, [ramen]);

    return (
        <div className="ramen-detail-page">
            <div className="header">
                <RamenDetail image={ramen.image} name={ramen.name} />
                <RamenInfoTable ramen={ramen} />
            </div>
            <div className="rating">
                <span>★ ★ ★ ★ ★</span>
            </div>
            <ReviewList />
            <ReviewForm />
        </div>
    );
};

export default RamenDetailPage;
