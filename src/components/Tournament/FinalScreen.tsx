import React from "react";
import { useNavigate } from "react-router-dom";

interface FinalScreenProps {
    champion: string;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ champion }) => {
    const navigate = useNavigate();

    const handleDetailPage = () => {
        // 상세 페이지로 이동하는 로직 (예: navigate(`/detail/${champion}`))
        alert("상세 페이지로 이동합니다.");
    };

    const handleHome = () => {
        // 홈 페이지로 이동하는 로직
        navigate("/");
    };

    return (
        <div className="final-screen">
            <h2>우승 라면: {champion}</h2>
            <button onClick={handleDetailPage}>상세 페이지 이동</button>
            <button onClick={handleHome}>홈으로</button>
        </div>
    );
};

export default FinalScreen;
