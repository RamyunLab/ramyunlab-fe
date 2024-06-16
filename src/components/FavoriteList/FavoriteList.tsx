import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FaStar } from "react-icons/fa";
import styles from "../RamyunList/RamyunList.module.scss"; // 공통 SCSS 파일 사용

interface FavoriteItem {
    ramyunIdx: number;
    ramyunName: string;
    ramyunImg: string;
    brandName: string;
    avgRate: number;
    reviewCount: number;
    isLiked: boolean;
}

interface FavoriteResponse {
    statusCode: number;
    message: string;
    data: {
        content: FavoriteItem[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            offset: number;
        };
        totalPages: number;
        totalElements: number;
    };
}

const FavoriteList: React.FC = () => {
    const [favoriteList, setFavoriteList] = useState<FavoriteItem[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoveredHeartIndex, setHoveredHeartIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const token = useSelector((state: RootState) => state.auth.token);
    const navigate = useNavigate();

    const fetchFavoriteList = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get<FavoriteResponse>(
                `${process.env.REACT_APP_API_SERVER}/api/user/favorite?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("API Response:", response.data); // 응답 데이터 로그
            if (response.data.statusCode === 200) {
                setFavoriteList(
                    response.data.data.content.map((item) => ({ ...item, isLiked: true }))
                );
                setTotalPages(response.data.data.totalPages);
                setError(null);
            } else {
                setError(`Failed to fetch data: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error); // 에러 로그
            setError("Error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavoriteList(page);
    }, [page]);

    const handleFavoriteAction = async (ramyunIdx: number, isLiked: boolean) => {
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (isLiked) {
                const response = await axios.delete(
                    `${process.env.REACT_APP_API_SERVER}/api/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        data: { ramyunIdx }, // 요청 본문에 ramyunIdx 포함
                    }
                );
                console.log("Response Data (Delete):", response.data); // 응답 데이터 로그
                alert("찜 해제 완료!");
            } else {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_SERVER}/api/favorites`,
                    { ramyunIdx },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Response Data (Post):", response.data); // 응답 데이터 로그
                alert("찜 완료!");
            }
        } catch (error) {
            console.error("Error during favorite action:", error); // 에러 로그
            alert("찜 작업 실패");
        }
    };

    const handleFavoriteToggle = async (ramyunIdx: number, isLiked: boolean) => {
        await handleFavoriteAction(ramyunIdx, isLiked);
        // Refresh data after favorite action
        setFavoriteList((prevList) =>
            prevList.map((item) =>
                item.ramyunIdx === ramyunIdx ? { ...item, isLiked: !isLiked } : item
            )
        );
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemClick = (ramyunIdx: number) => {
        navigate(`/main/ramyun/${ramyunIdx}`);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.pageButton} ${i === page ? styles.activePage : ""}`}
                >
                    {i}
                </button>
            );
        }

        return <div className={styles.pagination}>{pages}</div>;
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.ramyunListContainer}>
            <h2>찜 목록</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.ramyunList}>
                    {favoriteList.map((item, index) => (
                        <div
                            key={item.ramyunIdx}
                            className={`${styles.ramyunItem} ${
                                item.isLiked ? styles.favorite : ""
                            }`}
                            onClick={() => handleItemClick(item.ramyunIdx)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className={styles.topContainer}>
                                <FontAwesomeIcon
                                    icon={
                                        hoveredIndex === index
                                            ? solidHeart
                                            : item.isLiked
                                            ? solidHeart
                                            : regularHeart
                                    }
                                    onMouseEnter={() => setHoveredHeartIndex(index)}
                                    onMouseLeave={() => setHoveredHeartIndex(null)}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents the item click handler
                                        handleFavoriteToggle(item.ramyunIdx, item.isLiked);
                                    }}
                                    className={`${styles.favoriteIcon} ${
                                        item.isLiked ? styles.favorite : ""
                                    }`}
                                />
                            </div>
                            <img
                                src={item.ramyunImg}
                                alt={item.ramyunName}
                                className={styles.ramyunImg}
                            />
                            <h3>{item.ramyunName}</h3>
                            <p>{item.brandName}</p>
                            <div className={styles.starRating}>
                                <FaStar color="gold" />
                                <span>{item.avgRate ? item.avgRate.toFixed(1) : "0"}</span>
                                <span className={styles.reviewCount}>({item.reviewCount})</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {renderPagination()}
        </div>
    );
};

export default FavoriteList;
