import React from "react";
import { useNavigate } from "react-router-dom";
import xbox from "../assets/images/404.webp";
import "./404Page.scss";
const NotFoundPage: React.FC = () => {
    return (
        <div className="not-found-page">
            <img src={xbox} alt="Not Found" className="not-found-image" />

            <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
        </div>
    );
};

export default NotFoundPage;
