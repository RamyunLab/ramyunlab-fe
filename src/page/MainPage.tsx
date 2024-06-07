import React from "react";
import { Link } from "react-router-dom";
import "./banner.css"; // Import the CSS file for styling

const MainPage: React.FC = () => {
    return (
        <div>
            <Link to="/mbti" className="banner-link">
                <div className="banner">Go to MBTI Page</div>
            </Link>
            {/* 월드컵 페이지로 가는 새로운 링크를 추가합니다. */}
            <Link to="/tournament" className="banner-link">
                <div className="banner">Go to Worldcup Page</div>
            </Link>
            <Link to="/ramen/:idx" className="banner-link">
                <div className="banner">라면 상세페이지</div>
            </Link>
            <Link to="/UpDownGame" className="banner-link">
                <div className="banner">Go to Worldcup Page</div>
            </Link>
        </div>
    );
};

export default MainPage;
