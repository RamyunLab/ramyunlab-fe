import React from "react";
import { Link } from "react-router-dom";
import "./banner.css"; // Import the CSS file for styling

const MainPage: React.FC = () => {
    return (
        <Link to="/mbti" className="banner-link">
            <div className="banner">Go to MBTI Page</div>
        </Link>
    );
};

export default MainPage;
