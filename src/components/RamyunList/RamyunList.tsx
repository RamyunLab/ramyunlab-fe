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

    const [filters, setFilters] = useState<any>({
        name: "",
        brand: [],
        noodle: [],
        isCup: [],
        cooking: [],
        kcal: [],
        gram: [],
        na: [],
    });

    const [searchText, setSearchText] = useState<string>("");

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

    const getFiltersFromQuery = () => {
        const searchParams = new URLSearchParams(location.search);
        const filterKeys = ["name", "brand", "noodle", "isCup", "cooking", "kcal", "gram", "na"];
        const newFilters: any = {};
        filterKeys.forEach((key) => {
            newFilters[key] = searchParams.getAll(key);
        });
        return newFilters;
    };

    const [page, setPage] = useState<number>(getPageFromQuery());

    const fetchRamyunList = async (page: number, sort: string, direction: string, filters: any) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("sort", sort);
            params.append("direction", direction);
            Object.keys(filters).forEach((key) => {
                filters[key].forEach((value: any) => params.append(key, value));
            });
            const response = await axios.get<RamyunResponse>(
                `${process.env.REACT_APP_API_SERVER}/main/search?${params.toString()}`
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
        const currentFilters = getFiltersFromQuery();

        setPage(currentPage);
        setSort(currentSort);
        setDirection(currentDirection);
        setFilters(currentFilters);

        fetchRamyunList(currentPage, currentSort, currentDirection, currentFilters);
    }, [location.search]);

    const updateUrlParams = (
        newPage: number,
        newSort: string,
        newDirection: string,
        newFilters: any
    ) => {
        const params = new URLSearchParams();
        params.set("page", newPage.toString());
        params.set("sort", newSort);
        params.set("direction", newDirection);
        Object.keys(newFilters).forEach((key) => {
            newFilters[key].forEach((value: any) => params.append(key, value));
        });
        navigate(`?${params.toString()}`, { replace: false });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrlParams(newPage, sort, direction, filters);
    };

    const toggleSortDirection = () => {
        const newDirection = direction === "asc" ? "desc" : "asc";
        setDirection(newDirection);
        updateUrlParams(page, sort, newDirection, filters);
    };

    const handleSortChange = (newSort: string) => {
        if (sort === newSort) {
            toggleSortDirection();
        } else {
            setSort(newSort);
            setDirection("asc");
            updateUrlParams(1, newSort, "asc", filters);
            setPage(1);
        }
    };

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        const newFilters = { ...filters };
        if (checked) {
            newFilters[key] = [...newFilters[key], value];
        } else {
            newFilters[key] = newFilters[key].filter((v: string) => v !== value);
        }
        setFilters(newFilters);
        updateUrlParams(1, sort, direction, newFilters);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleSearchButtonClick = () => {
        const newFilters = { ...filters, name: [searchText] };
        setFilters(newFilters);
        updateUrlParams(1, sort, direction, newFilters);
        setPage(1);
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

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.ramyunListContainer}>
            <h1>Ramyun List</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchText}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <button onClick={handleSearchButtonClick} className={styles.searchButton}>
                Search
            </button>
            <div className={styles.filterContainer}>
                <div className={styles.filterGroup}>
                    <p>브랜드</p>
                    {["농심", "삼양", "오뚜기", "팔도"].map((brand) => (
                        <label
                            key={brand}
                            className={filters.brand.includes(brand) ? styles.active : ""}
                        >
                            <input
                                type="checkbox"
                                value={brand}
                                checked={filters.brand.includes(brand)}
                                onChange={(e) =>
                                    handleFilterChange("brand", brand, e.target.checked)
                                }
                            />
                            {brand}
                        </label>
                    ))}
                </div>

                <div className={styles.filterGroup}>
                    <p>면 유형</p>
                    {[true, false].map((noodle) => (
                        <label
                            key={String(noodle)}
                            className={filters.noodle.includes(String(noodle)) ? styles.active : ""}
                        >
                            <input
                                type="checkbox"
                                value={String(noodle)}
                                checked={filters.noodle.includes(String(noodle))}
                                onChange={(e) =>
                                    handleFilterChange("noodle", String(noodle), e.target.checked)
                                }
                            />
                            {noodle ? "건면" : "유탕면"}
                        </label>
                    ))}
                </div>
                <div className={styles.filterGroup}>
                    <p>용기 기준</p>
                    {[true, false].map((isCup) => (
                        <label
                            key={String(isCup)}
                            className={filters.isCup.includes(String(isCup)) ? styles.active : ""}
                        >
                            <input
                                type="checkbox"
                                value={String(isCup)}
                                checked={filters.isCup.includes(String(isCup))}
                                onChange={(e) =>
                                    handleFilterChange("isCup", String(isCup), e.target.checked)
                                }
                            />
                            {isCup ? "컵라면" : "봉지라면"}
                        </label>
                    ))}
                </div>
                <div className={styles.filterGroup}>
                    <p>조리 유형</p>
                    {[true, false].map((cooking) => (
                        <label
                            key={String(cooking)}
                            className={
                                filters.cooking.includes(String(cooking)) ? styles.active : ""
                            }
                        >
                            <input
                                type="checkbox"
                                value={String(cooking)}
                                checked={filters.cooking.includes(String(cooking))}
                                onChange={(e) =>
                                    handleFilterChange("cooking", String(cooking), e.target.checked)
                                }
                            />
                            {cooking ? "국물" : "볶음/비빔"}
                        </label>
                    ))}
                </div>
                <div className={styles.filterGroup}>
                    <p>칼로리</p>
                    {["~300", "300~500", "500~"].map((kcal) => (
                        <label
                            key={kcal}
                            className={filters.kcal.includes(kcal) ? styles.active : ""}
                        >
                            <input
                                type="checkbox"
                                value={kcal}
                                checked={filters.kcal.includes(kcal)}
                                onChange={(e) => handleFilterChange("kcal", kcal, e.target.checked)}
                            />
                            {kcal}
                        </label>
                    ))}
                </div>

                <div className={styles.filterGroup}>
                    <p>그램</p>
                    {["0-100", "100~"].map((gram) => (
                        <label
                            key={gram}
                            className={filters.gram.includes(gram) ? styles.active : ""}
                        >
                            <input
                                type="checkbox"
                                value={gram}
                                checked={filters.gram.includes(gram)}
                                onChange={(e) => handleFilterChange("gram", gram, e.target.checked)}
                            />
                            {gram}
                        </label>
                    ))}
                </div>

                <div className={styles.filterGroup}>
                    <p>나트륨</p>
                    {["~1000", "1000~1400", "1400~1700", "1700~"].map((na) => (
                        <label key={na} className={filters.na.includes(na) ? styles.active : ""}>
                            <input
                                type="checkbox"
                                value={na}
                                checked={filters.na.includes(na)}
                                onChange={(e) => handleFilterChange("na", na, e.target.checked)}
                            />
                            {na}mg
                        </label>
                    ))}
                </div>
            </div>

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
