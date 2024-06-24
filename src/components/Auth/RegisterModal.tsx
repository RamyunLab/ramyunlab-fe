import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface RegisterModalProps {
    toggleRegisterModal: () => void;
    toggleLoginModal: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ toggleRegisterModal, toggleLoginModal }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [idChecked, setIdChecked] = useState(false);
    const [idError, setIdError] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [idValid, setIdValid] = useState(false);
    const [nicknameValid, setNicknameValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        setPasswordMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.querySelector(".modal-content");
            if (modal && !modal.contains(event.target as Node)) {
                toggleRegisterModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleRegisterModal]);

    const isValidUserId = (userId: string) => {
        const userIdPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z][a-zA-Z0-9]{3,19}$$/;
        return userIdPattern.test(userId);
    };

    const isValidPassword = (password: string) => {
        const passwordPattern =
            /^(?=.*[a-zA-Z가-힣])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+\\|/.,<>?:;'\"{}[\]\\]).{8,}$/;
        return passwordPattern.test(password);
    };

    const isValidNickname = (nickname: string) => {
        const nicknamePattern = /^[a-zA-Z가-힣0-9]{2,10}$/;
        return nicknamePattern.test(nickname);
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setId(value);

        if (!isValidUserId(value)) {
            setIdError(
                "아이디는 4~20자 사이이며, 영어 대소문자와 숫자가 포함되어야 하고 숫자로 시작할 수 없습니다."
            );
            setIdValid(false);
        } else {
            setIdError("형식에 맞는 아이디입니다.");
            setIdValid(true);
        }
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickname(value);

        if (!isValidNickname(value)) {
            setNicknameError(
                "닉네임은 2~10자 사이이며, 영어, 한글, 숫자가 포함되어야 하고 숫자로 시작할 수 있습니다."
            );
            setNicknameValid(false);
        } else {
            setNicknameError("형식에 맞는 닉네임입니다.");
            setNicknameValid(true);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        if (!isValidPassword(value)) {
            setPasswordError(
                "비밀번호는 최소 8자 이상이며, 한글, 영어 대소문자, 특수기호, 숫자가 포함되어야 합니다."
            );
        } else {
            setPasswordError("");
        }
    };

    const handleRegister = async () => {
        if (!idValid) {
            alert("유효한 아이디를 입력해주세요.");
            return;
        }

        if (!nicknameValid) {
            alert("유효한 닉네임을 입력해주세요.");
            return;
        }

        if (!nicknameChecked) {
            alert("닉네임 중복 확인을 완료해주세요.");
            return;
        }

        if (!idChecked) {
            alert("아이디 중복 확인을 완료해주세요.");
            return;
        }

        if (!passwordMatch) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_SERVER}/auth/register`, {
                userId: id,
                password,
                nickname,
            });

            if (response.data.statusCode === 200) {
                alert("회원가입이 완료되었습니다.");
                toggleRegisterModal();
                toggleLoginModal(); // 회원가입 성공 후 로그인 모달로 전환
            } else {
                alert("회원가입에 실패했습니다: " + response.data.message);
            }
        } catch (error) {
            alert("회원가입에 실패했습니다.");
        }
    };

    const checkNickname = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_SERVER}/auth/checkNickname`,
                { nickname }
            );

            if (response.data.statusCode === 200) {
                setNicknameChecked(true);
                alert("닉네임 중복 확인 완료");
            } else {
                alert("닉네임이 이미 사용 중입니다.");
            }
        } catch (error) {
            alert("닉네임 중복 확인에 실패했습니다.");
        }
    };

    const checkId = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_SERVER}/auth/checkId`, {
                userId: id,
            });

            if (response.data.statusCode === 200) {
                setIdChecked(true);
                alert("아이디 중복 확인 완료");
            } else {
                alert("아이디가 이미 사용 중입니다.");
            }
        } catch (error) {
            alert("아이디 중복 확인에 실패했습니다.");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    return (
        <div className="modal" onKeyPress={handleKeyPress}>
            <div className="modal-content">
                <h2>회원가입</h2>
                <div className="userid">
                    <input type="text" placeholder="아이디" value={id} onChange={handleIdChange} />
                    <button onClick={checkId} className="checkIdBtn">
                        중복 확인
                    </button>
                </div>
                <div className="usermsg">
                    <div className={`error-message ${idValid ? "valid" : "invalid"}`}>
                        {idError}
                    </div>
                </div>
                <div className="nickname">
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={handleNicknameChange}
                    />
                    <button onClick={checkNickname} className="checkNicknameBtn">
                        중복 확인
                    </button>
                </div>
                <div className="nickmsg">
                    <div className={`error-message ${nicknameValid ? "valid" : "invalid"}`}>
                        {nicknameError}
                    </div>
                </div>
                <div className="password">
                    <div className="input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-icon"
                        />
                    </div>
                </div>
                <div className="passmsg">
                    <div className={`error-message ${passwordError ? "invalid" : "valid"}`}>
                        {passwordError}
                    </div>
                </div>
                <div className="confirm-password">
                    <div className="input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="password-icon"
                        />
                    </div>
                    {!passwordMatch && (
                        <div className="error-message invalid">비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
                <button onClick={handleRegister}>회원가입</button>

                <div className="links">
                    <span
                        onClick={() => {
                            toggleRegisterModal();
                            toggleLoginModal();
                        }}
                    >
                        로그인
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
