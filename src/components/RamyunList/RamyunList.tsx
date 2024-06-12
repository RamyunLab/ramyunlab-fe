import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
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
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sort, setSort] = useState<string>("name");
    const [direction, setDirection] = useState<string>("asc");

    const navigate = useNavigate();
    const location = useLocation();

    const getPageFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        const pageFromQuery = parseInt(searchParams.get("page") || "1", 10);
        return isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery;
    };

    const getSortFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get("sort") || "name";
    };

    const getDirectionFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get("direction") || "asc";
    };

    const [page, setPage] = useState<number>(getPageFromQuery());

    const fetchRamyunList = async (page: number, sort: string, direction: string) => {
        setLoading(true);
        try {
            const response = await axios.get<RamyunResponse>(
                `${process.env.REACT_APP_API_SERVER}/main?page=${page}&sort=${sort}&direction=${direction}`
            );
            if (response.data.statusCode === 200) {
                setRamyunList(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                setError(null);
            } else {
                setError("Failed to fetch data");
            }
        } catch (error) {
            setError("Error occurred while fetching data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const currentPage = getPageFromQuery();
        const currentSort = getSortFromQuery();
        const currentDirection = getDirectionFromQuery();

        setPage(currentPage);
        setSort(currentSort);
        setDirection(currentDirection);

        fetchRamyunList(currentPage, currentSort, currentDirection);
    }, [location.search]);

    const updateUrlParams = (newPage: number, newSort: string, newDirection: string) => {
        const params = new URLSearchParams();
        params.set("page", newPage.toString());
        params.set("sort", newSort);
        params.set("direction", newDirection);
        navigate(`?${params.toString()}`, { replace: false }); // Using push instead of replace
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrlParams(newPage, sort, direction);
    };

    const toggleSortDirection = () => {
        const newDirection = direction === "asc" ? "desc" : "asc";
        setDirection(newDirection);
        updateUrlParams(page, sort, newDirection);
    };

    const handleSortChange = (newSort: string) => {
        if (sort === newSort) {
            toggleSortDirection();
        } else {
            setSort(newSort);
            setDirection("asc");
            updateUrlParams(1, newSort, "asc");
            setPage(1);
        }
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
                    onClick={() => handlePageChange(i)}
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
                    onClick={() => handlePageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                {pages}
                <button
                    className={styles.nextButton}
                    onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
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
        <div className={styles.ramyunListContainer}>
            <h1>Ramyun List</h1>
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
            <div className={styles.ramyunList}>
                {ramyunList.map((ramyun) => (
                    <div key={ramyun.ramyunIdx} className={styles.ramyunItem}>
                        <div className={styles.starRating}>
                            <FaStar color="gold" />
                            <span>{ramyun.avgRate.toFixed(1)}</span>
                            <span className={styles.reviewCount}>({ramyun.reviewCount})</span>
                        </div>
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
    );
};

export default RamyunList;
