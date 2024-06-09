import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slices/AuthSlice.tsx"; // 로그아웃 액션 임포트
import styles from "./AccountModal.module.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccountModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("deleteAccount");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const [message, setMessage] = useState(""); // 피드백 메시지 상태 추가

    if (!isOpen) return null;

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // 인증 토큰 가져오기
            const response = await axios.delete(`${process.env.REACT_APP_API_SERVER}/api/user`, {
                data: { password }, // 비밀번호를 데이터로 전송
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 인증 토큰 추가
                },
            });

            if (response.data.statusCode === 200) {
                setMessage("계정이 삭제되었습니다.");
                dispatch(logout()); // 로그아웃 액션 디스패치
                localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
                setTimeout(onClose, 2000); // 2초 후 모달 닫기
            } else {
                setMessage("계정 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            setMessage("계정 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleNicknameChange = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // 인증 토큰 가져오기
            const response = await axios.patch(
                `${process.env.REACT_APP_API_SERVER}/api/user/nickname`,
                { nickname },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                }
            );

            if (response.data.statusCode === 200) {
                setMessage("닉네임이 변경되었습니다.");
                setTimeout(onClose, 2000); // 2초 후 모달 닫기
            } else {
                setMessage("닉네임 변경에 실패했습니다.");
            }
        } catch (error) {
            setMessage("닉네임 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // 인증 토큰 가져오기
            const response = await axios.patch(
                `${process.env.REACT_APP_API_SERVER}/api/user/password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                }
            );

            if (response.data.statusCode === 200) {
                setMessage("비밀번호가 변경되었습니다.");
                setTimeout(onClose, 2000); // 2초 후 모달 닫기
            } else {
                setMessage("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            setMessage("비밀번호 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentPasswordCheck = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // 인증 토큰 가져오기
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/api/user/password`,
                { currentPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // 인증 토큰 추가
                    },
                }
            );

            if (response.data.statusCode === 200) {
                setMessage("비밀번호가 확인되었습니다.");
            } else {
                setMessage("비밀번호 확인에 실패했습니다.");
            }
        } catch (error) {
            setMessage("비밀번호 확인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOutsideClick}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tabButton} ${
                            activeTab === "deleteAccount" ? styles.active : ""
                        }`}
                        onClick={() => handleTabChange("deleteAccount")}
                    >
                        회원 탈퇴
                    </button>
                    <button
                        className={`${styles.tabButton} ${
                            activeTab === "changeNickname" ? styles.active : ""
                        }`}
                        onClick={() => handleTabChange("changeNickname")}
                    >
                        닉네임 수정
                    </button>
                    <button
                        className={`${styles.tabButton} ${
                            activeTab === "changePassword" ? styles.active : ""
                        }`}
                        onClick={() => handleTabChange("changePassword")}
                    >
                        비밀번호 변경
                    </button>
                </div>
                <div className={styles.tabContent}>
                    {message && <p className={styles.message}>{message}</p>}
                    {activeTab === "deleteAccount" && (
                        <div className={styles.tabPane}>
                            <h2>회원 탈퇴</h2>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.inputField}
                            />
                            <button
                                className={styles.actionButton}
                                onClick={handleDeleteAccount}
                                disabled={loading}
                            >
                                {loading ? "삭제 중..." : "계정 영구 삭제"}
                            </button>
                        </div>
                    )}
                    {activeTab === "changeNickname" && (
                        <div className={styles.tabPane}>
                            <h2>닉네임 수정</h2>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="새 닉네임"
                                className={styles.inputField}
                            />
                            <button
                                className={styles.actionButton}
                                onClick={handleNicknameChange}
                                disabled={loading}
                            >
                                {loading ? "변경 중..." : "닉네임 변경"}
                            </button>
                        </div>
                    )}
                    {activeTab === "changePassword" && (
                        <div className={styles.tabPane}>
                            <h2>비밀번호 변경</h2>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="현재 비밀번호"
                                className={styles.inputField}
                            />
                            <button
                                className={styles.actionButton}
                                onClick={handleCurrentPasswordCheck}
                                disabled={loading}
                            >
                                {loading ? "확인 중..." : "비밀번호 확인"}
                            </button>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호"
                                className={styles.inputField}
                            />
                            <button
                                className={styles.actionButton}
                                onClick={handlePasswordChange}
                                disabled={loading}
                            >
                                {loading ? "변경 중..." : "비밀번호 변경"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
