import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Modal.scss";
import { Link } from "react-router-dom";

const RegisterModal: React.FC = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        setPasswordMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    const handleRegister = async () => {
        if (!nicknameChecked) {
            alert("닉네임 중복 확인을 완료해주세요.");
            return;
        }

        if (!passwordMatch) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post("/api/register", {
                id,
                password,
                nickname,
            });
            if (response.data.success) {
                alert("회원가입이 완료되었습니다.");
            } else {
                alert("회원가입에 실패했습니다: " + response.data.message);
            }
        } catch (error) {
            alert("회원가입에 실패했습니다.");
        }
    };

    const checkNickname = async () => {
        try {
            const response = await axios.post("/api/check-nickname", { nickname });
            if (response.data.success) {
                setNicknameChecked(true);
                alert("닉네임 중복 확인 완료");
            } else {
                alert("닉네임이 이미 사용 중입니다.");
            }
        } catch (error) {
            alert("닉네임 중복 확인에 실패했습니다.");
        }
    };

    return (
        <div className="modal">
            <h2>회원가입</h2>
            <input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <div className="nickname">
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <button onClick={checkNickname} className="checkNicknameBtn">
                    중복 확인
                </button>
            </div>
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="confirm-password">
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {!passwordMatch && (
                    <div className="error-message">비밀번호가 일치하지 않습니다.</div>
                )}
            </div>
            <button onClick={handleRegister}>회원가입</button>

            <div className="links">
                <Link to="/login">로그인</Link>
            </div>
        </div>
    );
};

export default RegisterModal;
