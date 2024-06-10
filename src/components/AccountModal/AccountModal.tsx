import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isPasswordChecked, setIsPasswordChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isCurrentPasswordChecked, setIsCurrentPasswordChecked] = useState(false);
    const [nicknameError, setNicknameError] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    if (!isOpen) return null;

    const isValidNickname = (nickname: string) => {
        const nicknamePattern = /^[a-zA-Z가-힣0-9]{2,10}$/;
        return nicknamePattern.test(nickname);
    };

    const isValidPassword = (password: string) => {
        const passwordPattern =
            /^(?=.*[a-zA-Z가-힣])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\\|/.,<>?:;'\"{}[\]\\]).{8,}$/;
        return passwordPattern.test(password);
    };

    const handleNicknameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickname(value);

        if (!isValidNickname(value)) {
            setNicknameError(
                "닉네임은 2~10자 사이이며, 영어, 한글, 숫자가 포함되어야 하고 숫자로 시작할 수 없습니다."
            );
            setIsNicknameChecked(false);
        } else {
            setNicknameError("형식에 맞는 닉네임입니다.");
            setIsNicknameChecked(true);
        }
    };

    const handleNewPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);

        if (!isValidPassword(value)) {
            setPasswordError(
                "비밀번호는 최소 8자 이상이며, 영어 대소문자, 특수기호, 숫자가 포함되어야 합니다."
            );
        } else {
            setPasswordError("형식에 맞는 비밀번호입니다.");
        }
    };

    const handleConfirmNewPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmNewPassword(value);

        if (value !== newPassword) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleCurrentPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrentPassword(value);

        if (!isValidPassword(value)) {
            setCurrentPasswordError(
                "비밀번호는 최소 8자 이상이며, 영어 대소문자, 특수기호, 숫자가 포함되어야 합니다."
            );
        } else {
            setCurrentPasswordError("형식에 맞는 비밀번호입니다.");
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setMessage("");
        setIsPasswordChecked(false);
        setIsNicknameChecked(false);
        setIsCurrentPasswordChecked(false);
        setNicknameError("");
        setCurrentPasswordError("");
        setPasswordError("");
        setConfirmPasswordError("");
    };

    const handleDeleteAccount = async () => {
        if (!isPasswordChecked) {
            alert("비밀번호 확인이 필요합니다.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${process.env.REACT_APP_API_SERVER}/api/user`, {
                data: { password },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.statusCode === 200) {
                alert("계정이 삭제되었습니다.");
                dispatch(logout());
                localStorage.removeItem("token");
                onClose();
            } else {
                alert("계정 삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("계정 삭제에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleNicknameChange = async () => {
        if (!isNicknameChecked) {
            alert("닉네임 확인이 필요합니다.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${process.env.REACT_APP_API_SERVER}/api/user/nickname`,
                { nickname },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200) {
                alert("닉네임이 변경되었습니다.");
            } else {
                alert("닉네임 변경에 실패했습니다.");
            }
        } catch (error) {
            alert("닉네임 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (newPassword === currentPassword) {
            alert("새 비밀번호가 현재 비밀번호와 동일할 수 없습니다.");
            return;
        }

        if (!isCurrentPasswordChecked) {
            alert("현재 비밀번호 확인이 필요합니다.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `${process.env.REACT_APP_API_SERVER}/api/user/password`,
                { password: newPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200) {
                alert("비밀번호가 변경되었습니다.");
            } else {
                alert("비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            alert("비밀번호 변경에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentPasswordCheck = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/api/user/password`,
                { password: currentPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200 && response.data.data) {
                alert("비밀번호가 확인되었습니다.");
                setIsCurrentPasswordChecked(true);
            } else {
                alert("비밀번호가 다릅니다.");
            }
        } catch (error) {
            alert("비밀번호 확인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordCheck = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/api/user/password`,
                { password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.statusCode === 200 && response.data.data) {
                alert("비밀번호가 확인되었습니다.");
                setIsPasswordChecked(true);
            } else {
                alert("비밀번호가 다릅니다.");
            }
        } catch (error) {
            alert("비밀번호 확인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleNicknameCheck = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/auth/checkNickname`,
                { nickname },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.statusCode === 200) {
                alert("닉네임이 사용 가능합니다.");
                setIsNicknameChecked(true);
            } else {
                alert("닉네임이 이미 사용 중입니다.");
            }
        } catch (error) {
            alert("닉네임 확인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (activeTab === "deleteAccount") handleDeleteAccount();
            else if (activeTab === "changeNickname") handleNicknameChange();
            else if (activeTab === "changePassword") handlePasswordChange();
        }
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).classList.contains(styles.modalOverlay)) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleOutsideClick} onKeyPress={handleKeyPress}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                <div className="tab-content">
                    {message && <p className={styles.message}>{message}</p>}
                    {activeTab === "deleteAccount" && (
                        <div className="tab-pane">
                            <h2>회원 탈퇴</h2>
                            <div className="input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-icon"
                                />
                                <button className="checkPasswordBtn" onClick={handlePasswordCheck}>
                                    비밀번호 확인
                                </button>
                            </div>
                            <p className="error-message">{passwordError}</p>
                            <button onClick={handleDeleteAccount}>
                                {loading ? "계정 영구 삭제" : "계정 영구 삭제"}
                            </button>
                        </div>
                    )}
                    {activeTab === "changeNickname" && (
                        <div className="tab-pane">
                            <h2>닉네임 수정</h2>
                            <div className="nickname">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={handleNicknameInputChange}
                                    placeholder="새 닉네임"
                                />
                                <button className="checkNicknameBtn" onClick={handleNicknameCheck}>
                                    확인
                                </button>
                            </div>
                            <p className="error-message">{nicknameError}</p>
                            <button onClick={handleNicknameChange} disabled={!isNicknameChecked}>
                                {loading ? "닉네임 변경" : "닉네임 변경"}
                            </button>
                        </div>
                    )}
                    {activeTab === "changePassword" && (
                        <div className="tab-pane">
                            <h2>비밀번호 변경</h2>
                            <div className="input-container">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={handleCurrentPasswordInputChange}
                                    placeholder="현재 비밀번호"
                                />
                                <FontAwesomeIcon
                                    icon={showCurrentPassword ? faEyeSlash : faEye}
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="password-icon"
                                />
                                <p className="error-message">{currentPasswordError}</p>
                                <button
                                    className="checkPasswordBtn"
                                    onClick={handleCurrentPasswordCheck}
                                >
                                    비밀번호 확인
                                </button>
                            </div>

                            <div className="password">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={handleNewPasswordInputChange}
                                    placeholder="새 비밀번호"
                                />
                                <FontAwesomeIcon
                                    icon={showNewPassword ? faEyeSlash : faEye}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="password-icon"
                                />
                            </div>
                            <p className="error-message">{passwordError}</p>
                            <div className="password">
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={handleConfirmNewPasswordInputChange}
                                    placeholder="새 비밀번호 확인"
                                />
                                <FontAwesomeIcon
                                    icon={showConfirmNewPassword ? faEyeSlash : faEye}
                                    onClick={() =>
                                        setShowConfirmNewPassword(!showConfirmNewPassword)
                                    }
                                    className="password-icon"
                                />
                            </div>
                            <p className="error-message">{confirmPasswordError}</p>
                            <button onClick={handlePasswordChange}>
                                {loading ? "비밀번호 변경" : "비밀번호 변경"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
