import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { RootState } from "../../Redux/store";
import {
    setRamen,
    setNextRamen,
    setGameOver,
    setMessage,
    incrementRound,
    resetGame,
    setShowScoville,
} from "../../Redux/slices/UpdownSlice.tsx";
import styles from "./UpDownGame.module.scss";

const fetchRamenData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
    return response.data;
};

const UpDownGame: React.FC = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { currentRamen, nextRamen, isGameOver, message, roundCount, finalRamen, showScoville } =
        useSelector((state: RootState) => state.updown);

    const { data, isError, refetch } = useQuery("ramenData", fetchRamenData, {
        onSuccess: (data) => {
            if (data.statusCode === 200) {
                dispatch(setRamen({ current: data.data[0], next: data.data[1] }));
            }
        },
        onError: () => {
            dispatch(setMessage("라면 데이터를 가져오는 데 실패했습니다."));
        },
    });

    const fetchNextRamen = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_SERVER}/game/updown`);
        const { statusCode, data } = response.data;
        if (statusCode === 200) {
            dispatch(setNextRamen(data[0]));
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
                            message: "축하합니다! 최종 라면을 맞추셨습니다.",
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
        }
    };

    const handleResetGame = () => {
        dispatch(resetGame());
        refetch();
    };

    if (isGameOver) {
        return (
            <div className={styles.gameOver}>
                <p>{message}</p>
                {finalRamen && (
                    <div className={styles.ramenContainer}>
                        <div className={styles.ramen}>
                            <img src={finalRamen.r_img} alt={finalRamen.r_name} />
                            <p>{finalRamen.r_name}</p>
                            <p>스코빌 지수: {finalRamen.r_scoville}</p>
                        </div>
                    </div>
                )}
                {!finalRamen && (
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
                <button onClick={handleResetGame}>다시 하기</button>
            </div>
        );
    }

    return (
        <div className={styles.gameContainer}>
            <h1 className={styles.title}>라면 업앤다운 게임</h1>
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
