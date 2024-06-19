import React, { useState, useEffect } from "react";
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
        onSubmit(content, rating, photo, rvReportCount);
        resetForm();
    };

    const resetForm = () => {
        setContent("");
        setRating(0);
        setPhoto(null);
        setPhotoPreview(null);
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
            {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
            <div className="button-group">
                <button type="submit" className="submit-button">
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
