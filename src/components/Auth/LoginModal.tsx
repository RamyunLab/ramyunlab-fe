import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.scss";

interface LoginModalProps {
    toggleLoginModal: () => void;
    toggleRegisterModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ toggleLoginModal, toggleRegisterModal }) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberId, setRememberId] = useState(false);

    useEffect(() => {
        const storedId = localStorage.getItem("rememberedId");
        if (storedId) {
            setId(storedId);
            setRememberId(true);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_SERVER}/auth/login`, {
                userId: id,
                password,
            });

            if (response.data.success) {
                if (rememberId) {
                    localStorage.setItem("rememberedId", id);
                } else {
                    localStorage.removeItem("rememberedId");
                }
                localStorage.setItem("userInfo", JSON.stringify(response.data.user));
                toggleLoginModal();
            } else {
                alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.");
            }
        } catch (error) {
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="modal">
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
    );
};

export default LoginModal;
