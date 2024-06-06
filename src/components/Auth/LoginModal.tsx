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
    const dispatch = useDispatch();

    useEffect(() => {
        const storedId = localStorage.getItem("rememberedId");
        if (storedId) {
            setId(storedId);
            setRememberId(true);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.querySelector(".modal-content");
            if (modal && !modal.contains(event.target as Node)) {
                toggleLoginModal();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleLoginModal]);

    const handleLogin = async () => {
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
                alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
            }
        } catch (error) {
            console.error("로그인 중 오류가 발생했습니다:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>로그인</h2>
                <input
                    type="text"
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <div className="remember-me">
                    <input
                        type="checkbox"
                        id="rememberUsername"
                        checked={rememberId}
                        onChange={(e) => setRememberId(e.target.checked)}
                    />
                    <label htmlFor="rememberId">아이디 저장</label>
                </div>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

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
