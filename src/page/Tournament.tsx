import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Matchup from "../components/Tournament/Matchup.tsx";
import FinalScreen from "../components/Tournament/FinalScreen.tsx";
import TournamentModal from "../components/Tournament/TournamentModal.tsx";
import "./Tournament.scss";
import "./TournamentModal.scss";
import { GameDTO } from "../types";
import {
    setRound,
    setCurrentMatchups,
    addWinner,
    clearWinners,
    setChampion,
    setCurrentMatchIndex,
} from "../Redux/slices/TournamentSlice.tsx";
import { RootState } from "../Redux/store";

const Tournament: React.FC = () => {
    const dispatch = useDispatch();
    const { round, currentMatchups, winners, champion, currentMatchIndex } = useSelector(
        (state: RootState) => state.tournament
    );

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
                })
                .catch((error) => {
                    console.error("라면 목록 조회 실패:", error);
                });
        }
    }, [round, dispatch]);

    const handleWinnerSelect = (winner: GameDTO) => {
        if (round === null) return;

        const newWinners = [...winners, winner];
        dispatch(addWinner(winner));

        if (newWinners.length === currentMatchups.length / 2) {
            if (round === 2) {
                dispatch(setChampion(newWinners[0]));
            } else {
                dispatch(setCurrentMatchups(newWinners));
                dispatch(clearWinners());
                dispatch(setRound(round / 2));
                dispatch(setCurrentMatchIndex(0));
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

    return (
        <div className="tournament">
            <h1>{round}강</h1>
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
