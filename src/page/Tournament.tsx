import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Matchup from "../components/Tournament/Matchup.tsx";
import { GameDTO } from "../Redux/types.ts";
import { RootState } from "../Redux/store.tsx";
import {
    setRound,
    setCurrentMatchups,
    addWinner,
    clearWinners,
    setChampion,
    setCurrentMatchIndex,
    resetTournament,
    setNextRound,
} from "../Redux/slices/TournamentSlice.tsx";
import "./Tournament.scss";

const Tournament: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { round, currentMatchups, winners, currentMatchIndex } = useSelector(
        (state: RootState) => state.tournament
    );
    const initialRound = location.state?.rounds || 16;

    useEffect(() => {
        if (round === null) {
            dispatch(setRound(initialRound));
        } else if (round !== null && currentMatchups.length === 0) {
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
    }, [round, currentMatchups.length, dispatch, initialRound]);

    const handleWinnerSelect = (winner: GameDTO) => {
        dispatch(addWinner(winner));

        if (winners.length + 1 === currentMatchups.length / 2) {
            if (round === 2) {
                navigate(`/tournament/result/${winner.r_idx}`, {
                    state: { champion: winner },
                });
            } else {
                setTimeout(() => {
                    dispatch(setNextRound());
                }, 0);
            }
        } else {
            dispatch(setCurrentMatchIndex(currentMatchIndex + 1));
        }
    };

    const handleTournamentStart = (rounds: number) => {
        dispatch(setRound(rounds));
        dispatch(clearWinners());
    };

    const currentMatchup = currentMatchups.slice(currentMatchIndex * 2, currentMatchIndex * 2 + 2);

    return (
        <div className="tournament">
            <h1>
                {round !== null && (round > 4 ? `${round}강` : round === 4 ? "준결승전" : "결승전")}
            </h1>
            {currentMatchup.length === 2 && (
                <Matchup
                    round={round || 0} // round가 null인 경우를 대비하여 기본값 0을 사용
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
