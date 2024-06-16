import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TournamentModal from "../components/Tournament/TournamentModal.tsx";
import "./banner.scss";
import mbtiImage from "../assets/images/ramyunmbti.jpg";
import worldcupImage from "../assets/images/worldcup.jpg";
import randomramyun from "../assets/images/RANDOM.webp";
import { Link } from "react-router-dom";
import SCOVILLE from "../assets/images/SCOVILLE2.png"; // Import the worldcup image
import RamyunList from "../components/RamyunList/RamyunList.tsx"; // Import the RamyunList component

const MainPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleTournamentClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleSelectRounds = (rounds: number) => {
        setShowModal(false);
        navigate("/tournament", { state: { rounds } });
    };

    const handleRandomRamyunClick = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_SERVER}/main/random`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const ramyun = response.data.data.ramyun;
            navigate(`/main/ramyun/${ramyun.ramyunIdx}`, { state: { ramyun } });
        } catch (error) {
            console.error("Failed to fetch random ramyun:", error);
        }
    };

    return (
        <div className="main-container">
            <div className="banners-container">
                <div className="banner">
                    <img src={mbtiImage} alt="MBTI Banner" />
                    <Link to="/mbti" className="banner-link">
                        <div className="banner-text"></div>
                    </Link>
                </div>
                <div className="banner" onClick={handleTournamentClick}>
                    <img src={worldcupImage} alt="Worldcup Banner" />
                    <div className="banner-text"></div>
                </div>
                <div className="banner">
                    <img src={SCOVILLE} alt="UpDownGame Banner" />
                    <Link to="/UpDownGame" className="banner-link">
                        <div className="banner-text"></div>
                    </Link>
                </div>
                <div className="banner" onClick={handleRandomRamyunClick}>
                    <img src={randomramyun} alt="randomramyun" />
                </div>
                {showModal && (
                    <TournamentModal onSelect={handleSelectRounds} onClose={handleModalClose} />
                )}
            </div>
            <div className="ramyun-list-container">
                <RamyunList />
            </div>
        </div>
    );
};

export default MainPage;
