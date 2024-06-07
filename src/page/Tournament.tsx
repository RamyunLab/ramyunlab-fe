import React, { useState, useEffect } from "react";
import axios from "axios";
import Matchup from "../components/Tournament/Matchup.tsx";
import FinalScreen from "../components/Tournament/FinalScreen.tsx";
import TournamentModal from "../components/Tournament/TournamentModal.tsx";
import "./Tournament.scss";
import "./TournamentModal.scss";
import { GameDTO } from "../types";

const Tournament: React.FC = () => {
    const [round, setRound] = useState<number | null>(null);
    const [currentMatchups, setCurrentMatchups] = useState<GameDTO[]>([]);
    const [winners, setWinners] = useState<GameDTO[]>([]);
    const [champion, setChampion] = useState<GameDTO | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);

    useEffect(() => {
        if (round !== null) {
            axios
                .get(`${process.env.REACT_APP_API_SERVER}/game/worldCup/${round}`)
                .then((response) => {
                    const data: GameDTO[] = response.data.data;
                    if (Array.isArray(data)) {
                        setCurrentMatchups(data);
                    } else {
                        console.error("응답 데이터가 배열이 아닙니다:", data);
                    }
                    setCurrentMatchIndex(0);
                })
                .catch((error) => {
                    console.error("라면 목록 조회 실패:", error);
                });
        }
    }, [round]);

    const handleWinnerSelect = (winner: GameDTO) => {
        if (round === null) return;

        const newWinners = [...winners, winner];
        setWinners(newWinners);

        if (newWinners.length === currentMatchups.length / 2) {
            if (round === 2) {
                setChampion(newWinners[0]);
            } else {
                setTimeout(() => {
                    setCurrentMatchups(newWinners);
                    setWinners([]);
                    setRound(round / 2);
                    setCurrentMatchIndex(0);
                }, 0);
            }
        } else {
            setCurrentMatchIndex(currentMatchIndex + 1);
        }
    };

    const handleTournamentStart = (rounds: number) => {
        setRound(rounds);
        setWinners([]);
        setChampion(null);
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
