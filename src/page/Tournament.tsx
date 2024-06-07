import React, { useState } from "react";
import Matchup from "../components/Tournament/Matchup.tsx";
import FinalScreen from "../components/Tournament/FinalScreen.tsx";
import TournamentModal from "../components/Tournament/TournamentModal.tsx";
import "./Tournament.scss";
import "./TournamentModal.scss";

const ramenList = [
    "라면 1",
    "라면 2",
    "라면 3",
    "라면 4",
    "라면 5",
    "라면 6",
    "라면 7",
    "라면 8",
    "라면 9",
    "라면 10",
    "라면 11",
    "라면 12",
    "라면 13",
    "라면 14",
    "라면 15",
    "라면 16",
    "라면 17",
    "라면 18",
    "라면 19",
    "라면 20",
    "라면 21",
    "라면 22",
    "라면 23",
    "라면 24",
    "라면 25",
    "라면 26",
    "라면 27",
    "라면 28",
    "라면 29",
    "라면 30",
    "라면 31",
    "라면 32",
];

const Tournament: React.FC = () => {
    const [round, setRound] = useState<number | null>(null);
    const [currentMatchups, setCurrentMatchups] = useState<string[]>([]);
    const [winners, setWinners] = useState<string[]>([]);
    const [champion, setChampion] = useState<string | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);

    const handleWinnerSelect = (winner: string) => {
        if (round === null) return; // round가 null인 경우를 처리

        const newWinners = [...winners, winner];
        setWinners(newWinners);

        if (newWinners.length === currentMatchups.length / 2) {
            if (round === 2) {
                setChampion(newWinners[0]);
            } else {
                setCurrentMatchups(newWinners);
                setWinners([]);
                setRound(round / 2);
                setCurrentMatchIndex(0);
            }
        } else {
            setCurrentMatchIndex(currentMatchIndex + 1);
        }
    };

    const handleTournamentStart = (rounds: number) => {
        setRound(rounds);
        setCurrentMatchups(ramenList.slice(0, rounds));
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
