import React, { useState, useEffect } from "react";
import axios from "axios";

interface ReviewFormProps {
    initialContent: string;
    initialRating: number;
    initialPhoto: string | null;
    onSubmit: (newContent: string, newRating: number, newPhoto: File | null) => void;
    onCancel: () => void;
    isEditMode: boolean;
    rvIdx?: number;
    ramyunIdx?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    initialContent,
    initialRating,
    initialPhoto,
    onSubmit,
    onCancel,
    isEditMode,
    rvIdx,
    ramyunIdx,
}) => {
    const [content, setContent] = useState(initialContent);
    const [rating, setRating] = useState(initialRating);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        console.log("Submit clicked");
        console.log("Content:", content);
        console.log("Rating:", rating);
        console.log("Photo:", photo);
        onSubmit(content, rating, photo);
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
                <button onClick={handleSubmit}>{isEditMode ? "수정" : "등록"}</button>
                {isEditMode && <button onClick={onCancel}>취소</button>}
            </div>
        </div>
    );
};

export default ReviewForm;
