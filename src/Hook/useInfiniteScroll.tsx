import { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";

interface Review {
    rvIdx: number;
    userIdx: number;
    rIdx: number;
    rvContent: string;
    rvRate: number;
    rvCreatedAt: string;
    reviewPhotoUrl: string | null;
    rvUpdatedAt: string | null;
    rvDeletedAt: string | null;
    nickname: string;
    liked: boolean;
    recommendIdx: number | null;
}

interface UseInfiniteScrollParams {
    ramyunIdx: string;
    initialPage: number;
    pageSize: number;
}

const useInfiniteScroll = ({ ramyunIdx, initialPage, pageSize }: UseInfiniteScrollParams) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState<number>(initialPage);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_SERVER}/api/review/${ramyunIdx}?page=${page}&size=${pageSize}`
                );
                const newReviews = response.data.data.content;
                setReviews((prev) => [...prev, ...newReviews]);
                setHasMore(newReviews.length === pageSize);
            } catch (error) {
                console.error("리뷰 데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        if (hasMore) {
            fetchReviews();
        }
    }, [page, ramyunIdx, pageSize, hasMore]);

    const lastReviewElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return { reviews, setReviews, loading, lastReviewElementRef };
};

export default useInfiniteScroll;
