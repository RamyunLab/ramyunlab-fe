import React, { useState, useEffect } from "react";

interface ReviewFormProps {
    initialContent: string;
    initialRating: number;
    initialPhoto: string | null;
    rvReportCount: number; // 새로운 prop 추가
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
    rvReportCount = 0, // 기본값 0으로 설정
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

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRating(Number(e.target.value));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPhoto(file);
        setPhotoPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(content, rating, photo, rvReportCount);
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={content} onChange={handleContentChange} />
            <input type="number" value={rating} onChange={handleRatingChange} min="1" max="5" />
            <input type="file" onChange={handlePhotoChange} />
            {photoPreview && <img src={photoPreview} alt="Preview" />}
            <button type="submit">{isEditMode ? "수정 완료" : "리뷰 등록"}</button>
            <button type="button" onClick={onCancel}>
                취소
            </button>
        </form>
    );
};

export default ReviewForm;
