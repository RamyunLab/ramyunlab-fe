import React from "react";

interface MatchupProps {
    round: number;
    matchNumber: number;
    totalMatches: number;
    ramen1: string;
    ramen2: string;
    onWinnerSelect: (winner: string) => void;
}

const Matchup: React.FC<MatchupProps> = ({
    round,
    matchNumber,
    totalMatches,
    ramen1,
    ramen2,
    onWinnerSelect,
}) => {
    return (
        <div className="matchup-container">
            <div className="matchup-header">
                {round}강 {matchNumber}/{totalMatches}
            </div>
            <div className="matchup">
                <div className="ramen-option" onClick={() => onWinnerSelect(ramen1)}>
                    <img src={`images/${ramen1}.jpg`} alt={ramen1} />
                    <div>{ramen1}</div>
                </div>
                <div className="vs">vs</div>
                <div className="ramen-option" onClick={() => onWinnerSelect(ramen2)}>
                    <img src={`images/${ramen2}.jpg`} alt={ramen2} />
                    <div>{ramen2}</div>
                </div>
            </div>
        </div>
    );
};

export default Matchup;
