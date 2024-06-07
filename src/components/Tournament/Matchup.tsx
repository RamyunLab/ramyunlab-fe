import React from "react";
import { GameDTO } from "../../types";
interface MatchupProps {
    round: number;
    matchNumber: number;
    totalMatches: number;
    ramen1: GameDTO;
    ramen2: GameDTO;
    onWinnerSelect: (winner: GameDTO) => void;
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
                    <img src={ramen1.r_img} alt={ramen1.r_name} />
                    <div>{ramen1.r_name}</div>
                </div>
                <div className="vs">vs</div>
                <div className="ramen-option" onClick={() => onWinnerSelect(ramen2)}>
                    <img src={ramen2.r_img} alt={ramen2.r_name} />
                    <div>{ramen2.r_name}</div>
                </div>
            </div>
        </div>
    );
};

export default Matchup;
