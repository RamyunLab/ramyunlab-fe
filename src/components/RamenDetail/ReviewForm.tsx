import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewForm: React.FC = () => {
    const ramyunIdx = "1"; // 임시 값 설정
    const [rating, setRating] = useState(3);
    const [content, setContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [userIdx, setUserIdx] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("userInfo");
        if (token && userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            setIsLoggedIn(true);
            setUserIdx(parsedUserInfo.userId);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (isLoggedIn && userIdx) {
            const token = localStorage.getItem("token");
            const currentDate = new Date().toISOString();
            const formData = new FormData();

            if (photo) {
                formData.append("file", photo);
            }

            const body = JSON.stringify({
                reviewContent: content,
                rate: rating,
                rvCreatedAt: currentDate,
            });
            const blob = new Blob([body], {
                type: "application/json",
            });
            formData.append("reviewDTO", blob);

            axios
                .post(`${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    alert("리뷰가 등록되었습니다.");
                    setContent("");
                    setRating(3);
                    setPhoto(null);
                    setPhotoPreview(null);
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
            <label className="file-label">
                이미지 업로드
                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            {photoPreview && (
                <div className="photo-preview">
                    <img src={photoPreview} alt="미리보기" />
                </div>
            )}
            <div className="submit-button-container">
                <button onClick={handleSubmit} disabled={!isLoggedIn}>
                    등록
                </button>
            </div>
        </div>
    );
};

export default ReviewForm;
