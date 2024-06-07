import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewForm: React.FC = () => {
    const [rating, setRating] = useState(3);
    const [content, setContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 토큰 확인
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleSubmit = () => {
        if (isLoggedIn) {
            const token = localStorage.getItem("token");
            axios
                .post(
                    "/api/review",
                    { rating, content },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    alert("리뷰가 등록되었습니다.");
                    setContent(""); // 폼 초기화
                    setRating(3); // 평점 초기화
                })
                .catch((error) => {
                    console.error("리뷰 등록 실패:", error);
                });
        } else {
            alert("로그인 상태를 확인할 수 없습니다.");
        }
    };

    return (
        <div className="review-form">
            <div className="rating">
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        className={index < rating ? "star filled" : "star"}
                        onClick={() => setRating(index + 1)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={handleSubmit} disabled={!isLoggedIn}>
                등록
            </button>
        </div>
    );
};

export default ReviewForm;
