import React from "react";

const RamenInfoTable: React.FC = () => {
    return (
        <table className="ramen-info-table">
            <tbody>
                <tr>
                    <td>브랜드</td>
                    <td>오뚜기</td>
                </tr>
                <tr>
                    <td>중량</td>
                    <td>1,000g</td>
                </tr>
                <tr>
                    <td>조리 방식</td>
                    <td>국물 라면</td>
                </tr>
                <tr>
                    <td>면 종류</td>
                    <td>건면</td>
                </tr>
                <tr>
                    <td>칼로리</td>
                    <td>500kcal</td>
                </tr>
                <tr>
                    <td>나트륨</td>
                    <td>200mg</td>
                </tr>
                <tr>
                    <td>스크빌지수</td>
                    <td>5,000</td>
                </tr>
            </tbody>
        </table>
    );
};

export default RamenInfoTable;
