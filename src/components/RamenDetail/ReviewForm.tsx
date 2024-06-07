import React from "react";

const ReviewForm: React.FC = () => {
    return (
        <div className="review-form">
            <div className="rating">★ ★ ★ ☆ ☆</div>
            <textarea placeholder="리뷰 내용 블라블라블라블라"></textarea>
            <button>등록</button>
        </div>
    );
};

export default ReviewForm;
