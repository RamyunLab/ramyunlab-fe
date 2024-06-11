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
    const [sort, setSort] = useState<string>("name");
    const [direction, setDirection] = useState<string>("desc");

    useEffect(() => {
        const fetchRamyunList = async () => {
            setLoading(true);
            try {
                const response = await axios.get<RamyunResponse>(
                    `${process.env.REACT_APP_API_SERVER}/main?page=${page}&sort=${sort}&direction=${direction}`
                );
                if (response.data.statusCode === 200) {
                    setRamyunList(response.data.data.content);
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

    const handleSortChange = (newSort: string, newDirection: string = "desc") => {
        setSort(newSort);
        setDirection(newDirection);
        setPage(1); // Reset to first page when sort changes
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
                <button onClick={() => handleSortChange("name", "asc")}>이름 (오름차순)</button>
                <button onClick={() => handleSortChange("name", "desc")}>이름 (내림차순)</button>
                <button onClick={() => handleSortChange("avgRate")}>평점(높은순)</button>
                <button onClick={() => handleSortChange("reviewCount")}>리뷰 개수(높은순)</button>
            </div>
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
            <div className={styles.pagination}>
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
        </div>
    );
};

export default RamyunList;
