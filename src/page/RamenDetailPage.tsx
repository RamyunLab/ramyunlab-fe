import React from "react";
import RamenDetail from "../components/RamenDetail/RamenDetail.tsx";
import RamenInfoTable from "../components/RamenDetail/RamenInfoTable.tsx";
import ReviewList from "../components/RamenDetail/ReviewList.tsx";
import ReviewForm from "../components/RamenDetail/ReviewForm.tsx";
import "./RamenDetailPage.scss";

const RamenDetailPage: React.FC = () => {
    return (
        <div className="ramen-detail-page">
            <div className="header">
                <RamenDetail />
                <RamenInfoTable />
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
