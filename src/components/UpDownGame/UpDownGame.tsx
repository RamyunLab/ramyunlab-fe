import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./UpDownGame.module.scss";

const UpDownGame = () => {
    const [currentRamen, setCurrentRamen] = useState(null);
    const [nextRamen, setNextRamen] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [message, setMessage] = useState("");
    const [showScoville, setShowScoville] = useState(false);

    useEffect(() => {
        fetchInitialRamenData();
    }, []);

    const fetchInitialRamenData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
            const { statusCode, data } = response.data;
            if (statusCode === 200) {
                setCurrentRamen(data[0]);
                setNextRamen(data[1]);
            } else {
                alert("라면 데이터를 가져오는 데 실패했습니다.");
                setIsGameOver(true);
            }
        } catch (error) {
            alert("라면 데이터를 가져오는 데 실패했습니다.");
            setIsGameOver(true);
        }
    };

    const fetchNextRamen = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
            const { statusCode, data } = response.data;
            if (statusCode === 200) {
                setNextRamen(data[0]); // 새로운 라면 데이터 가져오기
            } else {
                alert("라면 데이터를 가져오는 데 실패했습니다.");
                setIsGameOver(true);
            }
        } catch (error) {
            alert("라면 데이터를 가져오는 데 실패했습니다.");
            setIsGameOver(true);
        }
    };

    const handleGuess = (selectedRamen) => {
        if (!currentRamen || !nextRamen) return;

        const otherRamen = currentRamen === selectedRamen ? nextRamen : currentRamen;

        if (selectedRamen.r_scoville > otherRamen.r_scoville) {
            setMessage("맞췄습니다! 스코빌 지수를 확인하세요.");
            setShowScoville(true);
            setTimeout(() => {
                setCurrentRamen(selectedRamen);
                setShowScoville(false);
                fetchNextRamen(); // 새로운 라면 데이터를 가져와서 nextRamen으로 설정
                setMessage("다음 라운드로 이동합니다.");
            }, 2000);
        } else {
            setIsGameOver(true);
            setMessage("게임 오버");
        }
    };

    if (isGameOver) {
        return (
            <div className={styles.gameOver}>
                <p>{message}</p>
                <div className={styles.ramenContainer}>
                    <div className={styles.ramen}>
                        <img src={currentRamen.r_img} alt={currentRamen.r_name} />
                        <p>{currentRamen.r_name}</p>
                        <p>스코빌 지수: {currentRamen.r_scoville}</p>
                    </div>
                    <div className={styles.ramen}>
                        <img src={nextRamen.r_img} alt={nextRamen.r_name} />
                        <p>{nextRamen.r_name}</p>
                        <p>스코빌 지수: {nextRamen.r_scoville}</p>
                    </div>
                </div>
                <button onClick={() => window.location.reload()}>다시 하기</button>
            </div>
        );
    }

    return (
        <div className={styles.gameContainer}>
            {currentRamen && nextRamen && (
                <div className={styles.ramenContainer}>
                    <div className={styles.ramen} onClick={() => handleGuess(currentRamen)}>
                        <img src={currentRamen.r_img} alt={currentRamen.r_name} />
                        <p>{currentRamen.r_name}</p>
                        {showScoville && <p>스코빌 지수: {currentRamen.r_scoville}</p>}
                    </div>
                    <div className={styles.ramen} onClick={() => handleGuess(nextRamen)}>
                        <img src={nextRamen.r_img} alt={nextRamen.r_name} />
                        <p>{nextRamen.r_name}</p>
                        {showScoville && <p>스코빌 지수: {nextRamen.r_scoville}</p>}
                    </div>
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpDownGame;
