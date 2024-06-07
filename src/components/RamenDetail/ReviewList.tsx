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

    return (
        <div className="review-list">
            {reviews.map((review, index) => (
                <div className="review" key={index}>
                    <div className="nickname">{review.nickname}</div>
                    <div className="content">{review.content}</div>
                    <div className="date">{review.date}</div>
                    <div className="likes">❤️ {review.likes}</div>
                    <div className="rating">{review.rating} ★</div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
