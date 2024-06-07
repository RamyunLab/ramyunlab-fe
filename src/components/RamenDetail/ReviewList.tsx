import React from "react";

const ReviewList: React.FC = () => {
    return (
        <div className="review-list">
            <div className="review">
                <div className="nickname">닉네임</div>
                <div className="content">댓글 내용 블라블라블라</div>
                <div className="date">2024-05-31</div>
            </div>
            <div className="review">
                <div className="nickname">닉네임</div>
                <div className="content">댓글 내용 블라블라블라</div>
                <div className="date">2024-05-31</div>
            </div>
            <div className="review">
                <div className="nickname">닉네임</div>
                <div className="content">댓글 내용 블라블라블라</div>
                <div className="date">2024-05-31</div>
            </div>
        </div>
    );
};

export default ReviewList;
