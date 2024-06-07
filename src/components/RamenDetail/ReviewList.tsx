import React from "react";

const ReviewList: React.FC = () => {
    const reviews = [
        {
            nickname: "닉네임",
            content: "댓글 내용 블라블라블라",
            date: "2024-05-31",
            likes: 131,
            rating: 4.5,
        },
        {
            nickname: "닉네임",
            content: "댓글 내용 블라블라블라",
            date: "2024-05-31",
            likes: 23,
            rating: 4.0,
        },
        {
            nickname: "닉네임",
            content: "댓글 내용 블라블라블라",
            date: "2024-05-31",
            likes: 35,
            rating: 3.5,
        },
        {
            nickname: "닉네임",
            content: "댓글 내용 블라블라블라",
            date: "2024-05-31",
            likes: 9,
            rating: 3.0,
        },
    ];

    const bestReview = reviews.reduce((prev, current) =>
        prev.likes > current.likes ? prev : current
    );

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }, (_, i) => (
                    <span key={`full-${i}`} className="star full">
                        ★
                    </span>
                ))}
                {halfStar && <span className="star half">☆</span>}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <span key={`empty-${i}`} className="star empty">
                        ☆
                    </span>
                ))}
            </>
        );
    };

    return (
        <div className="review-list">
            <div className="best-review-container">
                <h2 className="best-review-title">Best Review</h2>
                <div className="best-review">
                    <div className="nickname">{bestReview.nickname}</div>
                    <div className="review-content">
                        <div className="content">{bestReview.content}</div>
                        <div className="date">{bestReview.date}</div>
                    </div>
                    <div className="likes-rating">
                        <div className="rating">{renderStars(bestReview.rating)}</div>
                        <div className="likes">❤️ {bestReview.likes}</div>
                    </div>
                </div>
            </div>
            <div className="divider"></div> {/* 구분선 추가 */}
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="nickname">{review.nickname}</div>
                    <div className="review-content">
                        <div className="content">{review.content}</div>
                        <div className="date">{review.date}</div>
                    </div>
                    <div className="likes-rating">
                        <div className="rating">{renderStars(review.rating)}</div>
                        <div className="likes">❤️ {review.likes}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
