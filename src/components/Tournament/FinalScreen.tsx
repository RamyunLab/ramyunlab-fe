import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GameDTO } from "../../Redux/types";
import { resetTournament } from "../../Redux/slices/TournamentSlice.tsx";

interface FinalScreenProps {
    champion: GameDTO;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ champion }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDetailPage = () => {
        navigate(`/ramen/${champion.idx}`);
    };

    const handleHome = () => {
        dispatch(resetTournament());
        navigate("/");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "토너먼트 우승 라면",
                    text: `토너먼트에서 우승한 라면은 ${champion.r_name}입니다!`,
                    url: window.location.href,
                });
                alert("공유가 완료되었습니다.");
            } catch (error) {
                alert("공유에 실패했습니다.");
            }
        } else {
            alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
        }
    };

    const handleKakaoShare = () => {
        if (window.Kakao) {
            window.Kakao.Link.sendDefault({
                objectType: "feed",
                content: {
                    title: "토너먼트 우승 라면",
                    description: `토너먼트에서 우승한 라면은 ${champion.r_name}입니다!`,
                    imageUrl: champion.r_img,
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: "웹으로 보기",
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        } else {
            alert("카카오톡 공유 기능을 초기화하는 데 실패했습니다.");
        }
    };

    return (
        <div className="final-screen">
            <h2>우승 라면: {champion.r_name}</h2>
            <div className="championImg">
                <img src={champion.r_img} alt={champion.r_name} />
            </div>
            <button onClick={handleHome}>홈으로</button>
            <button onClick={handleDetailPage}>상세 페이지 이동</button>
            <button className="share-button" onClick={handleShare}>
                결과 공유하기
            </button>
            <button className="kakao-share-button" onClick={handleKakaoShare}>
                카카오톡으로 공유
            </button>
        </div>
    );
};

export default FinalScreen;
