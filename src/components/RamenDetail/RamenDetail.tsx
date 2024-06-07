import React from "react";

interface RamenDetailProps {
    image: string;
    name: string;
}

const RamenDetail: React.FC<RamenDetailProps> = ({ image, name }) => {
    return (
        <div className="ramen-detail">
            <div className="ramen-image">
                <img src={image} alt={name} />
            </div>
            <div className="ramen-name">{name}</div>
        </div>
    );
};

export default RamenDetail;
