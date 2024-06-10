import React, { useEffect, useRef } from "react";

interface TournamentModalProps {
    onSelect: (rounds: number) => void;
    onClose: () => void;
}

const TournamentModal: React.FC<TournamentModalProps> = ({ onSelect, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleSelect = (rounds: number) => {
        onSelect(rounds);
    };

    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
                <h2>토너먼트 시작</h2>
                <button onClick={() => handleSelect(64)}>64강</button>
                <button onClick={() => handleSelect(32)}>32강</button>
                <button onClick={() => handleSelect(16)}>16강</button>
            </div>
        </div>
    );
};

export default TournamentModal;
