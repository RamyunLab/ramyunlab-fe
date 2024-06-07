import React from "react";

interface RamenDetailProps {
    image: string | null;
}

const RamenDetail: React.FC<RamenDetailProps> = ({ image }) => {
    return <div className="ramen-detail">{image && <img src={image} alt="Ramen" />}</div>;
};

export default RamenDetail;
