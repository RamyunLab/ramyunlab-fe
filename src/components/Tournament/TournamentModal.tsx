import React from "react";

interface TournamentModalProps {
    onSelect: (rounds: number) => void;
}

const TournamentModal: React.FC<TournamentModalProps> = ({ onSelect }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>토너먼트 시작</h2>
                <button onClick={() => onSelect(128)}>128강</button>
                <button onClick={() => onSelect(64)}>64강</button>
                <button onClick={() => onSelect(32)}>32강</button>
                <button onClick={() => onSelect(16)}>16강</button>
            </div>
        </div>
    );
};

export default TournamentModal;
