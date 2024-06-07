import React from "react";

interface RamenInfoTableProps {
    ramen: {
        brand: string;
        weight: string;
        cookingMethod: string;
        noodleType: string;
        calories: string;
        sodium: string;
        scoville: string;
    };
}

const RamenInfoTable: React.FC<RamenInfoTableProps> = ({ ramen }) => {
    return (
        <table className="ramen-info-table">
            <tbody>
                <tr>
                    <td>브랜드</td>
                    <td>{ramen.brand}</td>
                </tr>
                <tr>
                    <td>중량</td>
                    <td>{ramen.weight}</td>
                </tr>
                <tr>
                    <td>조리 방식</td>
                    <td>{ramen.cookingMethod}</td>
                </tr>
                <tr>
                    <td>면 종류</td>
                    <td>{ramen.noodleType}</td>
                </tr>
                <tr>
                    <td>칼로리</td>
                    <td>{ramen.calories}</td>
                </tr>
                <tr>
                    <td>나트륨</td>
                    <td>{ramen.sodium}</td>
                </tr>
                <tr>
                    <td>스크빌지수</td>
                    <td>{ramen.scoville}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default RamenInfoTable;
