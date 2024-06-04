import React, { useState, useCallback, useEffect } from "react";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
            console.log("Toggling menu, current state:", menuOpen); // 상태 변경 로그
            setMenuOpen((prev) => !prev);
        },
        [menuOpen]
    );

    const handleClickOutside = useCallback((event: MouseEvent) => {
        const menu = document.querySelector(`.${styles.menu}`);
        const menuIcon = document.querySelector(`.${styles.menuIcon}`);
        if (
            menu &&
            !menu.contains(event.target as Node) &&
            !menuIcon?.contains(event.target as Node)
        ) {
            console.log("Clicked outside menu, closing menu."); // 외부 클릭 로그
            setMenuOpen(false);
        }
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener("click", handleClickOutside);
            console.log("Event listener added for outside click."); // 이벤트 리스너 추가 로그
        } else {
            document.removeEventListener("click", handleClickOutside);
            console.log("Event listener removed for outside click."); // 이벤트 리스너 제거 로그
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen, handleClickOutside]);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>Ramen Lap</div>
            <button className={styles.menuIcon} onClick={toggleMenu}>
                내 메뉴
            </button>
            <div className={`${styles.menu} ${menuOpen ? styles.show : ""}`}>
                <ul>
                    <li>회원 정보 수정</li>
                    <li>로그 아웃</li>
                    <li>찜 목록</li>
                    <li>내가 쓴 리뷰</li>
                    <li>공감한 리뷰</li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
