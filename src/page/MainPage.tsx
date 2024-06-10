import React from "react";
import { Link } from "react-router-dom";
import "./banner.scss"; // Import the CSS file for styling
import mbtiImage from "../assets/images/ramyunmbti.jpg"; // Import the image
import worldcupImage from "../assets/images/worldcup.jpg"; // Import the worldcup image
import SCOVILLE from "../assets/images/SCOVILLE2.png"; // Import the worldcup image
const MainPage: React.FC = () => {
    return (
        <div className="banners-container">
            <div className="banner">
                <img src={mbtiImage} alt="MBTI Banner" />
                <Link to="/mbti" className="banner-link">
                    <div className="banner-text"></div>
                </Link>
            </div>
            <div className="banner">
                <img src={worldcupImage} alt="Worldcup Banner" />
                <Link to="/tournament" className="banner-link">
                    <div className="banner-text"></div>
                </Link>
            </div>
            <div className="banner">
                <img src={SCOVILLE} alt="UpDownGame Banner" />
                <Link to="/UpDownGame" className="banner-link">
                    <div className="banner-text"></div>
                </Link>
            </div>
            <div className="banner">
                <img src="/path/to/your/ramen-detail-image.jpg" alt="Ramen Detail Banner" />
                <Link to="/ramen/:idx" className="banner-link">
                    <div className="banner-text">라면 상세페이지</div>
                </Link>
            </div>
        </div>
    );
};

export default MainPage;
