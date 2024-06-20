import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewForm.scss";

interface ReviewFormProps {
    initialContent: string;
    initialRating: number;
    initialPhoto: string | null;
    rvReportCount: number;
    onSubmit: (content: string, rating: number, photo: File | null, reportCount: number) => void;
    onCancel: () => void;
    isEditMode: boolean;
    rvIdx?: number;
    ramyunIdx?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    initialContent,
    initialRating,
    initialPhoto,
    rvReportCount = 0,
    onSubmit,
    onCancel,
    isEditMode,
    rvIdx,
    ramyunIdx,
}) => {
    const [content, setContent] = useState<string>(initialContent);
    const [rating, setRating] = useState<number>(initialRating);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        setContent(initialContent);
        setRating(initialRating);
        setPhotoPreview(initialPhoto);
    }, [initialContent, initialRating, initialPhoto]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPhoto(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("로그인을 해주세요!");
            return;
        }
        if (rating === 0) {
            alert("별점을 등록해주세요");
            return;
        }
        onSubmit(content, rating, photo, rvReportCount);
        resetForm();
    };

    const resetForm = () => {
        setContent("");
        setRating(0);
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleDeletePhoto = async () => {
        if (rvIdx && photoPreview) {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_SERVER}/api/reviewImg/${rvIdx}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.statusCode === 200) {
                    alert("리뷰 이미지 삭제 성공");
                    setPhotoPreview(null);
                    setPhoto(null);
                } else {
                    alert("리뷰 이미지 삭제에 실패했습니다.");
                }
            } catch (error) {
                console.error("이미지 삭제 오류:", error);
                alert("이미지 삭제에 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div className="form-header">
                <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
            <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="리뷰를 입력하세요"
                className="review-textarea"
                rows={15}
            />
            <input type="file" onChange={handlePhotoChange} className="file-input" />
            {photoPreview && (
                <div className="photo-container">
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                    <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="delete-button"
                        disabled={loading}
                        style={{ width: "30px" }}
                    >
                        X
                    </button>
                </div>
            )}
            <div className="button-group">
                <button type="submit" className="submit-button" disabled={loading}>
                    {isEditMode ? "수정 완료" : "리뷰 등록"}
                </button>
                {isEditMode && (
                    <button type="button" onClick={onCancel} className="cancel-button">
                        취소
                    </button>
                )}
            </div>
        </form>
    );
};

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState<number>(0);

    const handleMouseEnter = (index: number) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (index: number) => {
        onRatingChange(index);
    };

    return (
        <div className="star-rating">
            {Array.from({ length: 5 }, (_, index) => {
                const starIndex = index + 1;
                return (
                    <span
                        key={starIndex}
                        className={`star ${starIndex <= (hoverRating || rating) ? "filled" : ""}`}
                        onMouseEnter={() => handleMouseEnter(starIndex)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starIndex)}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default ReviewForm;
