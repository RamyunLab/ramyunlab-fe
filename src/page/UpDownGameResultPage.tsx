import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "../components/UpDownGame/UpDownGame.module.scss";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { resetGame } from "../Redux/slices/UpdownSlice.tsx"; // resetGame 액션 임포트

const ResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { width, height } = useWindowSize();
    const finalRamen = location.state?.finalRamen;

    const handleGoHome = () => {
        navigate("/");
    };

    const handleRestart = () => {
        dispatch(resetGame()); // 게임 상태 초기화
        navigate("/UpDownGame");
    };

    const handleShareResult = () => {
        const shareData = {
            title: "라면 스코빌 업앤다운 게임 결과",
            text: `나는 ${finalRamen?.r_name} 라면의 스코빌 지수를 맞췄습니다! 스코빌 지수: ${finalRamen?.r_scoville}`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            alert("공유 기능을 사용할 수 없습니다. 이 브라우저에서는 지원되지 않습니다.");
        }
    };

    return (
        <div className={styles.gameContainer}>
            {finalRamen && (
                <>
                    <Confetti width={width} height={height} />
                    <h1>게임 결과</h1>
                    <div className={styles.ramenContainer}>
                        <div className={styles.ramen}>
                            <img src={finalRamen.r_img} alt={finalRamen.r_name} />
                            <p>{finalRamen.r_name}</p>
                            <p>스코빌 지수: {finalRamen.r_scoville}</p>
                        </div>
                    </div>
                </>
            )}
            {!finalRamen && <p>결과를 불러오지 못했습니다.</p>}
            <div className={styles.buttonContainer}>
                <button onClick={handleGoHome}>홈으로 가기</button>
                <button onClick={handleRestart}>다시 하기</button>
                {finalRamen && <button onClick={handleShareResult}>결과 공유하기</button>}
            </div>
        </div>
    );
};

export default ResultPage;
