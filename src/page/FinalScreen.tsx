import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { GameDTO } from "../Redux/types.ts";
import { useDispatch } from "react-redux";
import { resetTournament } from "../Redux/slices/TournamentSlice.tsx";

const FinalScreen: React.FC = () => {
    const { ramenId } = useParams<{ ramenId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [champion, setChampion] = useState<GameDTO | null>(null);

    useEffect(() => {
        const championFromState = location.state?.champion;
        if (championFromState) {
            setChampion(championFromState);
        } else if (ramenId) {
            axios
                .get(`${process.env.REACT_APP_API_SERVER}/game/result/${ramenId}`)
                .then((response) => {
                    console.log(response);
                    setChampion(response.data.data);
                })
                .catch((error) => {
                    console.error("우승 라면 정보 조회 실패:", error);
                });
        }
    }, [ramenId, location.state]);

    const handleDetailPage = () => {
        if (champion) {
            navigate(`/main/ramyun/${champion.r_idx}`);
        }
    };

    const handleHome = () => {
        dispatch(resetTournament()); // 상태 초기화
        navigate("/");
    };

    const handleShare = async () => {
        if (navigator.share && champion) {
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
        if (champion) {
            const detailPageUrl = `http://43.203.209.183/tournament/result/${champion.r_idx}`;
            if (window.Kakao) {
                window.Kakao.Link.sendDefault({
                    objectType: "feed",
                    content: {
                        title: "토너먼트 우승 라면",
                        description: `토너먼트에서 우승한 라면은 ${champion.r_name}입니다!`,
                        imageUrl: champion.r_img,
                        link: {
                            mobileWebUrl: detailPageUrl,
                            webUrl: detailPageUrl,
                        },
                    },
                    buttons: [
                        {
                            title: "웹으로 보기",
                            link: {
                                mobileWebUrl: detailPageUrl,
                                webUrl: detailPageUrl,
                            },
                        },
                    ],
                });
            } else {
                alert("카카오톡 공유 기능을 초기화하는 데 실패했습니다.");
            }
        }
    };

    if (!champion) {
        return (
            <div className="final-screen">
                <h2>우승 라면 정보를 불러오는 중...</h2>
            </div>
        );
    }

    return (
        <div className="final-screen">
            <h2>우승 라면: {champion.r_name}</h2>
            <div className="championImg">
                <img src={champion.r_img} alt={champion.r_name} />
            </div>
            <button onClick={handleHome}>홈으로</button>
            <button onClick={handleDetailPage}>상세 페이지 이동</button>
            <button className="kakao-share-button" onClick={handleKakaoShare}>
                카카오톡으로 공유
            </button>
        </div>
    );
};

export default FinalScreen;
