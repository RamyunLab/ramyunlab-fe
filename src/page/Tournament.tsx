import React, { useState, useEffect } from "react";
import axios from "axios";
import Matchup from "../components/Tournament/Matchup.tsx";
import FinalScreen from "../components/Tournament/FinalScreen.tsx";
import TournamentModal from "../components/Tournament/TournamentModal.tsx";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    setRound,
    setCurrentMatchups,
    addWinner,
    clearWinners,
    setChampion,
    setCurrentMatchIndex,
    resetTournament,
} from "../Redux/slices/TournamentSlice.tsx";
import { RootState } from "../Redux/store";
import "./Tournament.scss";
import "./TournamentModal.scss";
import { GameDTO } from "../Redux/types.ts";

const Tournament: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { round, currentMatchups, winners, champion, currentMatchIndex } = useSelector(
        (state: RootState) => state.tournament
    );

    useEffect(() => {
        // 페이지가 로드될 때마다 토너먼트 상태를 초기화합니다.
        dispatch(resetTournament());
    }, [location, dispatch]);

    useEffect(() => {
        if (round !== null) {
            axios
                .get(`${process.env.REACT_APP_API_SERVER}/game/worldCup/${round}`)
                .then((response) => {
                    const data: GameDTO[] = response.data.data;
                    if (Array.isArray(data)) {
                        dispatch(setCurrentMatchups(data));
                    } else {
                        console.error("응답 데이터가 배열이 아닙니다:", data);
                    }
                    dispatch(setCurrentMatchIndex(0));
                })
                .catch((error) => {
                    console.error("라면 목록 조회 실패:", error);
                });
        }
    }, [round, dispatch]);

    const handleWinnerSelect = (winner: GameDTO) => {
        if (round === null) return;

        dispatch(addWinner(winner));

        if (winners.length + 1 === currentMatchups.length / 2) {
            if (round === 2) {
                dispatch(setChampion(winner));
            } else {
                setTimeout(() => {
                    dispatch(setCurrentMatchups(winners.concat(winner)));
                    dispatch(clearWinners());
                    dispatch(setRound(round / 2));
                    dispatch(setCurrentMatchIndex(0));
                }, 0);
            }
        } else {
            dispatch(setCurrentMatchIndex(currentMatchIndex + 1));
        }
    };

    const handleTournamentStart = (rounds: number) => {
        dispatch(setRound(rounds));
        dispatch(clearWinners());
        dispatch(setChampion(null));
    };

    if (round === null) {
        return <TournamentModal onSelect={handleTournamentStart} />;
    }

    if (champion) {
        return <FinalScreen champion={champion} />;
    }

    const currentMatchup = currentMatchups.slice(currentMatchIndex * 2, currentMatchIndex * 2 + 2);

    const getRoundName = (round: number) => {
        if (round === 4) return "준결승전";
        if (round === 2) return "결승전";
        return `${round}강`;
    };

    return (
        <div className="tournament">
            <h1>{getRoundName(round)}</h1>
            {currentMatchup.length === 2 && (
                <Matchup
                    round={round}
                    matchNumber={currentMatchIndex + 1}
                    totalMatches={currentMatchups.length / 2}
                    ramen1={currentMatchup[0]}
                    ramen2={currentMatchup[1]}
                    onWinnerSelect={handleWinnerSelect}
                />
            )}
        </div>
    );
};

export default Tournament;
