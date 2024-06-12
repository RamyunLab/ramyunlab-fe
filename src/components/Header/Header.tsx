import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 추가
import { RootState } from "../../Redux/store";
import { logout } from "../../Redux/slices/AuthSlice.tsx";
import styles from "./Header.module.scss";
import logo from "../../assets/images/lower_half2.png"; // 로고 이미지 파일 경로

interface HeaderProps {
    toggleLoginModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleLoginModal }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // navigate 추가

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

    const handleAccountPage = () => {
        setMenuOpen(false);
        navigate("/account"); // 계정 페이지로 이동
    };

    return (
        <header className={styles.header}>
            <Link to="/">
                <img src={logo} alt="RamyunLab Logo" className={styles.logo} />
            </Link>
            {isAuthenticated ? (
                <div>
                    <button className={styles.menuIcon} onClick={toggleMenu}>
                        내 메뉴
                    </button>
                    <div className={`${styles.menu} ${menuOpen ? styles.show : ""}`}>
                        <ul>
                            <li onClick={handleAccountPage}>마이페이지</li>{" "}
                            {/* 페이지 이동으로 변경 */}
                            <li onClick={handleLogout}>로그아웃</li>
                            <li>찜 목록</li>
                            <li>내가 쓴 리뷰</li>
                            <li>공감한 리뷰</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button className={styles.loginButton} onClick={toggleLoginModal}>
                    로그인
                </button>
            )}
        </header>
    );
};

export default Header;
