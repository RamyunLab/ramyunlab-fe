import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.scss";
import { Link } from "react-router-dom";

interface LoginModalProps {
    toggleLoginModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ toggleLoginModal }) => {
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
            const response = await axios.post("/api/login", { id, password });

            if (response.data.success) {
                // 서버에서 success 필드를 통해 로그인 성공 여부를 반환한다고 가정
                // 로그인 성공 처리
                if (rememberId) {
                    localStorage.setItem("rememberedId", id);
                } else {
                    localStorage.removeItem("rememberedId");
                }
                localStorage.setItem("userInfo", JSON.stringify(response.data.user)); // 사용자 정보를 로컬 스토리지에 저장
                toggleLoginModal(); // 로그인 성공 시 모달 닫기
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
                <Link to="/register">회원 가입</Link>
            </div>
        </div>
    );
};

export default LoginModal;
