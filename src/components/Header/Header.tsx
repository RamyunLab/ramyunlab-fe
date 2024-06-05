import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { logout } from "../../Redux/slices/AuthSlice.tsx";
import styles from "./Header.module.scss";
import LoginModal from "../Auth/LoginModal.tsx";
interface HeaderProps {
    toggleLoginModal: () => void;
    toggleRegisterModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleLoginModal }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const toggleMenu = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();
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
            setMenuOpen(false);
        }
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen, handleClickOutside]);

    const handleLogout = () => {
        dispatch(logout());
        setMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>Ramen Lab</div>
            {isAuthenticated ? (
                <div>
                    <button className={styles.menuIcon} onClick={toggleMenu}>
                        내 메뉴
                    </button>
                    <div className={`${styles.menu} ${menuOpen ? styles.show : ""}`}>
                        <ul>
                            <li>회원 정보 수정</li>
                            <li onClick={handleLogout}>로그 아웃</li>
                            <li>찜 목록</li>
                            <li>내가 쓴 리뷰</li>
                            <li>공감한 리뷰</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button onClick={toggleLoginModal}>로그인</button>
            )}
        </header>
    );
};

export default Header;
