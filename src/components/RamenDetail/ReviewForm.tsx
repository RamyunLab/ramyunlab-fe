import React, { useState } from "react";

const ReviewForm: React.FC = () => {
    const [rating, setRating] = useState(3);

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
            <textarea placeholder="내용을 입력하세요"></textarea>
            <button>등록</button>
        </div>
    );
};

export default ReviewForm;
