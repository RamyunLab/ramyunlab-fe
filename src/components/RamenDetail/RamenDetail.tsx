import React from "react";

interface RamenDetailProps {
    image: string;
}

const RamenDetail: React.FC<RamenDetailProps> = ({ image }) => {
    return (
        <div className="ramen-detail">
            <div className="ramen-image">
                <img src={image} alt="Ramen" />
            </div>
        </div>
    );
};

export default RamenDetail;
