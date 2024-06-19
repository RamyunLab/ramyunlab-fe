import React from "react";
import styles from "../RamyunList/RamyunList.module.scss"; // 동일한 SCSS 파일을 사용

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const pages: React.ReactNode[] = [];

    const totalBlocks = Math.ceil(totalPages / 5);
    const currentBlock = Math.ceil(currentPage / 5);

    const startPage = Math.max(1, (currentBlock - 1) * 5 + 1);
    const endPage = Math.min(startPage + 4, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`${styles.pageButton} ${i === currentPage ? styles.activePage : ""}`}
            >
                {i}
            </button>
        );
    }

    return (
        <div className={styles.pagination}>
            <button
                className={styles.prevButton}
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            {pages}
            <button
                className={styles.nextButton}
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
