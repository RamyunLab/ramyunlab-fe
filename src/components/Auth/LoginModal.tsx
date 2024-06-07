import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance.tsx";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/slices/AuthSlice.tsx";
import "./Modal.scss";

interface LoginModalProps {
    toggleLoginModal: () => void;
    toggleRegisterModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ toggleLoginModal, toggleRegisterModal }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberId, setRememberId] = useState(false);
    const [idError, setIdError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const storedId = localStorage.getItem("rememberedId");
        if (storedId) {
            setId(storedId);
            setRememberId(true);
        }
    }, []);

    const isValidUserId = (userId: string) => {
        const userIdPattern = /^(?=[a-zA-Z])[a-zA-Z0-9_-]{4,20}$/;
        return userIdPattern.test(userId);
    };

    const isValidPassword = (password: string) => {
        const passwordPattern =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+\\|/.,<>?:;'\"{}[\]\\]).{8,}$/;
        return passwordPattern.test(password);
    };

    const handleLogin = async () => {
        let valid = true;

        if (!isValidUserId(id)) {
            setIdError(
                "아이디는 4~20자 사이이며, 영어 대소문자와 숫자가 포함되어야 하고 숫자로 시작할 수 없습니다."
            );
            valid = false;
        } else {
            setIdError("");
        }

        if (!isValidPassword(password)) {
            setPasswordError(
                "비밀번호는 최소 8자 이상이며, 한글, 영어 대소문자, 특수기호, 숫자가 포함되어야 합니다."
            );
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) {
            return;
        }

        try {
            const response = await axiosInstance.post(`/auth/login`, {
                userId: id,
                password,
            });

            console.log(response.data); // 서버 응답 확인

            if (response.data.statusCode === 200) {
                const { token, userId, idx } = response.data.data;

                if (rememberId) {
                    localStorage.setItem("rememberedId", id);
                } else {
                    localStorage.removeItem("rememberedId");
                }

                localStorage.setItem("token", token);
                localStorage.setItem("userInfo", JSON.stringify({ userId, idx }));

                // 리덕스 상태 업데이트
                dispatch(login(token));
                toggleLoginModal();
            } else {
                alert(
                    response.data.message ||
                        "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요."
                );
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error;
            if (errorMessage) {
                if (errorMessage === "존재하지 않는 아이디입니다.") {
                    alert("아이디가 존재하지 않습니다.");
                } else if (errorMessage === "비밀번호가 틀렸습니다.") {
                    alert("비밀번호가 맞지 않습니다.");
                } else {
                    alert(errorMessage);
                }
            } else {
                alert("로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>로그인</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                {idError && <div className="error-message invalid">{idError}</div>}
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {passwordError && <div className="error-message invalid">{passwordError}</div>}
                <div className="remember-me">
                    <input
                        type="checkbox"
                        id="rememberUsername"
                        checked={rememberId}
                        onChange={(e) => setRememberId(e.target.checked)}
                    />
                    <label htmlFor="rememberId">아이디 저장</label>
                </div>
                <button onClick={handleLogin}>로그인</button>
                <button onClick={toggleLoginModal}>닫기</button>
                <div className="links">
                    <span onClick={toggleRegisterModal}>회원 가입</span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
