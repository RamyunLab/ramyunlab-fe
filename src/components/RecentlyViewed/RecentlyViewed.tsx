import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import styles from "../RamyunList/RamyunList.module.scss"; // 공통 SCSS 파일 사용

interface Ramyun {
    ramyunIdx: number;
    ramyunName: string;
    ramyunImg: string;
    brandName: string;
    noodle: boolean;
    ramyunKcal: number;
    isCup: boolean;
    cooking: boolean;
    gram: number;
    ramyunNa: number;
    scoville: number | null;
    avgRate: number | null;
    reviewCount: number;
    isLiked: boolean;
}

const RecentlyViewed: React.FC = () => {
    const [viewedRamyunList, setViewedRamyunList] = useState<Ramyun[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const userId = userInfo.userId;

        const viewedRamyunListKey = `viewedRamyunList_${userId}`;
        const savedViewedRamyunList = JSON.parse(localStorage.getItem(viewedRamyunListKey) || "[]");
        setViewedRamyunList(savedViewedRamyunList);
    }, []);

    const handleRamyunClick = (ramyun: Ramyun) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const userId = userInfo.userId;

        if (userId) {
            const viewedRamyunListKey = `viewedRamyunList_${userId}`;
            let savedViewedRamyunList = JSON.parse(
                localStorage.getItem(viewedRamyunListKey) || "[]"
            );

            // 기존에 이미 저장된 라면인지 확인
            const existingIndex = savedViewedRamyunList.findIndex(
                (item: Ramyun) => item.ramyunIdx === ramyun.ramyunIdx
            );
            if (existingIndex !== -1) {
                // 이미 있는 경우, 해당 항목을 리스트에서 제거
                savedViewedRamyunList.splice(existingIndex, 1);
            }

            // 12개 초과 시 가장 오래된 항목을 제거하고 나머지 항목들을 앞으로 한 칸씩 옮기기
            if (savedViewedRamyunList.length >= 12) {
                savedViewedRamyunList.shift();
            }

            // 리스트의 마지막에 추가
            savedViewedRamyunList.push(ramyun);

            // 로컬 스토리지에 저장
            localStorage.setItem(viewedRamyunListKey, JSON.stringify(savedViewedRamyunList));
            setViewedRamyunList(savedViewedRamyunList);
        }

        navigate(`/main/ramyun/${ramyun.ramyunIdx}`, { state: { ramyun } });
    };

    const handleFavoriteAction = async (ramyunIdx: number, isLiked: boolean) => {
        const token = localStorage.getItem("token"); // Assuming you store JWT token in local storage
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (isLiked) {
                await axios.delete(`${process.env.REACT_APP_API_SERVER}/api/favorites`, {
                    data: { ramyunIdx },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("찜 해제 완료!");
            } else {
                await axios.post(
                    `${process.env.REACT_APP_API_SERVER}/api/favorites`,
                    { ramyunIdx },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("찜 완료!");
            }
        } catch (error) {
            alert("찜 작업 실패");
        }
    };

    const handleFavoriteToggle = async (ramyunIdx: number, isLiked: boolean) => {
        await handleFavoriteAction(ramyunIdx, isLiked);
        // Refresh data after favorite action
        setViewedRamyunList((prevList) =>
            prevList.map((item) =>
                item.ramyunIdx === ramyunIdx ? { ...item, isLiked: !isLiked } : item
            )
        );
    };

    return (
        <div className={styles.ramyunListContainer}>
            <h2>최근 본 라면</h2>
            <div className={styles.ramyunList}>
                {viewedRamyunList.length === 0 ? (
                    <p>최근 본 라면이 없습니다.</p>
                ) : (
                    viewedRamyunList.map((ramyun, index) => (
                        <div
                            key={ramyun.ramyunIdx}
                            className={`${styles.ramyunItem} ${
                                ramyun.isLiked ? styles.favorite : ""
                            }`}
                            onClick={() => handleRamyunClick(ramyun)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className={styles.topContainer}>
                                <FontAwesomeIcon
                                    icon={
                                        ramyun.isLiked || hoveredIndex === index
                                            ? solidHeart
                                            : regularHeart
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents the item click handler
                                        handleFavoriteToggle(ramyun.ramyunIdx, ramyun.isLiked);
                                    }}
                                    className={`${styles.favoriteIcon} ${
                                        ramyun.isLiked ? styles.favorite : ""
                                    }`}
                                />
                            </div>

                            <img
                                src={ramyun.ramyunImg}
                                alt={ramyun.ramyunName}
                                className={styles.ramyunImg}
                            />
                            <h3>{ramyun.ramyunName}</h3>
                            <div className={styles.starRating}>
                                <FaStar color="gold" />
                                <span>{(ramyun.avgRate ?? 0).toFixed(1)}</span>
                                <span className={styles.reviewCount}>({ramyun.reviewCount})</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentlyViewed;
