import React, { useState } from "react";
import Matchup from "../components/Tournament/Matchup.tsx";
import FinalScreen from "../components/Tournament/FinalScreen.tsx";
import "./Tournament.scss";

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
];

const Tournament: React.FC = () => {
    const [round, setRound] = useState(16);
    const [currentMatchups, setCurrentMatchups] = useState([...ramenList]);
    const [winners, setWinners] = useState<string[]>([]);
    const [champion, setChampion] = useState<string | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    const handleWinnerSelect = (winner: string) => {
        setWinners((prev) => [...prev, winner]);

        if (winners.length + 1 === currentMatchups.length / 2) {
            if (round === 2) {
                setChampion(winner);
            } else {
                setCurrentMatchups([...winners, winner]);
                setWinners([]);
                setRound(round / 2);
                setCurrentMatchIndex(0);
            }
        } else {
            setCurrentMatchIndex((prev) => prev + 1);
        }
    };

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
