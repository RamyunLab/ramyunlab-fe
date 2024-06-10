import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import {
    setRamen,
    setNextRamen,
    setGameOver,
    setMessage,
    incrementRound,
    resetGame,
    setShowScoville,
    addSeenRamen,
} from "../../Redux/slices/UpdownSlice.tsx";
import ProgressBar from "../MBTI/ProgressBar.tsx";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import styles from "./UpDownGame.module.scss";

const fetchRamenData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
    return response.data;
};

const UpDownGame: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { width, height } = useWindowSize();
    const {
        currentRamen,
        nextRamen,
        isGameOver,
        message,
        roundCount,
        finalRamen,
        showScoville,
        seenRamen,
    } = useSelector((state: RootState) => state.updown);

    const { data, isError, refetch } = useQuery("ramenData", fetchRamenData, {
        onSuccess: (data) => {
            if (data.statusCode === 200) {
                if (!currentRamen && !nextRamen) {
                    const newRamen = data.data.filter(
                        (ramen) =>
                            seenRamen && !seenRamen.some((seen) => seen.r_idx === ramen.r_idx)
                    );
                    if (newRamen.length < 2) {
                        dispatch(setMessage("더 이상 새로운 라면이 없습니다."));
                        dispatch(setGameOver({ finalRamen: currentRamen, message: "게임 종료" }));
                    } else {
                        dispatch(setRamen({ current: newRamen[0], next: newRamen[1] }));
                        dispatch(addSeenRamen(newRamen[0]));
                        dispatch(addSeenRamen(newRamen[1]));
                    }
                }
            }
        },
        onError: () => {
            dispatch(setMessage("라면 데이터를 가져오는 데 실패했습니다."));
        },
    });

    const fetchNextRamen = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
        const { statusCode, data } = response.data;
        if (statusCode === 200 && Array.isArray(data)) {
            const newRamen = data.filter(
                (ramen) => seenRamen && !seenRamen.some((seen) => seen.r_idx === ramen.r_idx)
            );
            if (newRamen.length === 0) {
                dispatch(setMessage("더 이상 새로운 라면이 없습니다."));
                dispatch(setGameOver({ finalRamen: currentRamen, message: "게임 종료" }));
            } else {
                dispatch(setNextRamen(newRamen[0]));
                dispatch(addSeenRamen(newRamen[0]));
            }
        } else {
            dispatch(
                setGameOver({
                    finalRamen: null,
                    message: "라면 데이터를 가져오는 데 실패했습니다.",
                })
            );
        }
    };

    const handleGuess = (selectedRamen) => {
        if (!currentRamen || !nextRamen) return;
        const otherRamen = currentRamen === selectedRamen ? nextRamen : currentRamen;
        if (selectedRamen.r_scoville > otherRamen.r_scoville) {
            dispatch(setMessage("맞췄습니다! 스코빌 지수를 확인하세요."));
            dispatch(setShowScoville(true));
            setTimeout(() => {
                dispatch(setShowScoville(false));
                if (roundCount + 1 === 10) {
                    dispatch(
                        setGameOver({
                            finalRamen: selectedRamen,
                            message: "축하합니다! 스코빌이 가장 높은 라면을 맞추셨습니다.",
                        })
                    );
                } else {
                    dispatch(setRamen({ current: selectedRamen, next: null }));
                    fetchNextRamen(); // 새로운 라면 데이터를 가져와서 nextRamen으로 설정
                    dispatch(incrementRound());
                    dispatch(setMessage("")); // 메시지를 빈 문자열로 설정하여 메시지가 보이지 않도록 함
                }
            }, 2000);
        } else {
            dispatch(setGameOver({ finalRamen: null, message: "게임 오버" }));
            dispatch(setShowScoville(true)); // Show scoville score on game over
        }
    };

    const handleResetGame = () => {
        dispatch(resetGame());
        refetch();
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={styles.gameContainer}>
            {isGameOver && finalRamen && (
                <>
                    <Confetti width={width} height={height} />
                </>
            )}
            <h1 className={styles.title}>라면 스코빌 업앤다운 게임</h1>
            {!isGameOver && (
                <ProgressBar currentStep={roundCount + 1} totalSteps={10} /> /* ProgressBar 추가 */
            )}
            {message && !isGameOver && <p>{message}</p>}
            {isGameOver && finalRamen && <p>{message}</p>}
            {isGameOver && !finalRamen && (
                <div className={styles.gameResult}>
                    <h1 className={styles.gameOverTitle}>
                        <span>G</span>
                        <span>a</span>
                        <span>m</span>
                        <span>e</span>
                        <span>&nbsp;</span>
                        <span>O</span>
                        <span>v</span>
                        <span>e</span>
                        <span>r</span>
                    </h1>
                </div>
            )}
            {currentRamen && nextRamen && !isGameOver && (
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
            {isGameOver && finalRamen && (
                <div className={styles.ramenContainer}>
                    <div className={styles.ramen}>
                        <img src={finalRamen?.r_img} alt={finalRamen?.r_name} />
                        <p>{finalRamen?.r_name}</p>
                        <p>스코빌 지수: {finalRamen?.r_scoville}</p>
                    </div>
                </div>
            )}
            {isGameOver && !finalRamen && currentRamen && nextRamen && (
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
            )}
            {isGameOver && (
                <div className={styles.buttonContainer}>
                    <button onClick={handleResetGame}>다시 하기</button>
                    <button onClick={handleGoHome}>홈으로 가기</button>
                </div>
            )}
        </div>
    );
};

export default UpDownGame;
