import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RamyunList.module.scss";

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
    avgRate: number;
    reviewCount: number;
}

interface RamyunResponse {
    statusCode: number;
    message: string;
    data: {
        content: Ramyun[];
        pageable: {
            pageNumber: number;
            pageSize: number;
        };
        totalPages: number;
        totalElements: number;
    };
}

const RamyunList: React.FC = () => {
    const [ramyunList, setRamyunList] = useState<Ramyun[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sort, setSort] = useState<string>("name");
    const [direction, setDirection] = useState<string>("asc"); // 기본값을 오름차순으로 설정

    useEffect(() => {
        const fetchRamyunList = async () => {
            setLoading(true);
            try {
                const response = await axios.get<RamyunResponse>(
                    `${process.env.REACT_APP_API_SERVER}/main?page=${page}&sort=${sort}&direction=${direction}`
                );
                if (response.data.statusCode === 200) {
                    setRamyunList(response.data.data.content);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    setError("Failed to fetch data");
                }
            } catch (error) {
                setError("Error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchRamyunList();
    }, [page, sort, direction]);

    const toggleSortDirection = () => {
        setDirection((prevDirection) => (prevDirection === "asc" ? "desc" : "asc"));
    };

    const handleSortChange = (newSort: string) => {
        if (sort === newSort) {
            toggleSortDirection();
        } else {
            setSort(newSort);
            setDirection("asc"); // 새로운 정렬 기준으로 변경할 때 오름차순으로 설정
        }
        setPage(1); // Reset to first page when sort changes
    };

    const renderPagination = () => {
        const pages = [];
        const totalBlocks = Math.ceil(totalPages / 5);
        const currentBlock = Math.ceil(page / 5);

        const startPage = (currentBlock - 1) * 5 + 1;
        const endPage = Math.min(currentBlock * 5, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`${styles.pageButton} ${i === page ? styles.activePage : ""}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className={styles.pagination}>
                <button
                    className={styles.prevButton}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                {pages}
                <button
                    className={styles.nextButton}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.filterButton} ${sort === "name" ? styles.active : ""}`}
                        onClick={() => handleSortChange("name")}
                    >
                        이름 ({direction === "asc" ? "오름차순" : "내림차순"})
                    </button>
                </div>
                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.filterButton} ${
                            sort === "avgRate" ? styles.active : ""
                        }`}
                        onClick={() => handleSortChange("avgRate")}
                    >
                        평점(높은순)
                    </button>
                </div>
                <div className={styles.filterGroup}>
                    <button
                        className={`${styles.filterButton} ${
                            sort === "reviewCount" ? styles.active : ""
                        }`}
                        onClick={() => handleSortChange("reviewCount")}
                    >
                        리뷰 개수(높은순)
                    </button>
                </div>
            </div>
            <div className={styles.ramyunListContainer}>
                <div className={styles.ramyunList}>
                    {ramyunList.map((ramyun) => (
                        <div key={ramyun.ramyunIdx} className={styles.ramyunItem}>
                            <p>avgRate: {ramyun.avgRate}</p>
                            <img
                                src={ramyun.ramyunImg}
                                alt={ramyun.ramyunName}
                                className={styles.ramyunImg}
                            />
                            <h3>{ramyun.ramyunName}</h3>
                        </div>
                    ))}
                </div>
                {renderPagination()}
            </div>
        </div>
    );
};

export default RamyunList;
