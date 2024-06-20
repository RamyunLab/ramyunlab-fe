import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { resetTournament, setRound } from "../../Redux/slices/TournamentSlice.tsx";

interface TournamentModalProps {
    onSelect: (rounds: number) => void;
    onClose: () => void;
}

const TournamentModal: React.FC<TournamentModalProps> = ({ onSelect, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

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
        dispatch(resetTournament()); // 토너먼트 상태 초기화
        dispatch(setRound(rounds)); // 라운드 설정
        onSelect(rounds); // 필요하다면 이 부분도 유지
        onClose(); // 모달 닫기
    };

    return (
        <div className="modal">
            <div className="modal-content" ref={modalRef}>
                <h2>토너먼트 시작</h2>
                <button onClick={() => handleSelect(32)}>32강</button>
                <button onClick={() => handleSelect(16)}>16강</button>
                <button onClick={() => handleSelect(8)}>8강</button>
            </div>
        </div>
    );
};

export default TournamentModal;
