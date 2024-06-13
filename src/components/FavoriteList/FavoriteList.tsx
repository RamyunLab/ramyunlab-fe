import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import styles from "./FavoriteList.module.scss";

interface FavoriteItem {
    ramyunIdx: number;
    ramyunName: string;
    ramyunImg: string;
    brandName: string;
    avgRate: number;
    reviewCount: number;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const token = useSelector((state: RootState) => state.auth.token);

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
                setFavoriteList(response.data.data.content);
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

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
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
        <div className={styles.favoriteListContainer}>
            <h2>찜 목록</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.favoriteList}>
                    {favoriteList.map((item) => (
                        <div key={item.ramyunIdx} className={styles.favoriteItem}>
                            <img
                                src={item.ramyunImg}
                                alt={item.ramyunName}
                                className={styles.ramyunImg}
                            />
                            <h3>{item.ramyunName}</h3>
                            <p>{item.brandName}</p>
                            <div className={styles.rating}>
                                <span>평점: {item.avgRate.toFixed(1)}</span>
                                <span>리뷰 수: {item.reviewCount}</span>
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
