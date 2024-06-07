import React, { useEffect, useRef } from "react";

interface TournamentModalProps {
    onSelect: (rounds: number) => void;
}

const TournamentModal: React.FC<TournamentModalProps> = ({ onSelect }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // 모달 바깥을 클릭하면 홈페이지로 이동
                window.location.href = "/";
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
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
