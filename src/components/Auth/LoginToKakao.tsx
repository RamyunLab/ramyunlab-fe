import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance.tsx";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/slices/AuthSlice.tsx";

const LoginToKakao: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    console.log(`Authorization code: ${code}`); // code 값 로그 확인

    const loginToKakao = async () => {
        try {
            if (code) {
                const response = await axiosInstance.get(
                    `${process.env.REACT_APP_API_SERVER}/auth/callback?code=${code}`
                );
                console.log(response.data);

                if (response.data.statusCode === 200) {
                    const { token, userId, userIdx } = response.data.data;

                    localStorage.setItem("token", token);
                    localStorage.setItem("userInfo", JSON.stringify({ userId, userIdx }));

                    // 로그인 상태를 Redux에 업데이트
                    dispatch(login(token));

                    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
                    if (userInfo.userId === "admin123") {
                        navigate("/userPage");
                    } else {
                        navigate("/");
                    }
                } else {
                    console.log(response.data);
                    alert("로그인에 실패했습니다.");
                }
            } else {
                alert("인증 코드가 없습니다.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };
    useEffect(() => {
        loginToKakao();
    }, []);
    return (
        <div>
            <h1>Loading...</h1>
        </div>
    );
};
export default LoginToKakao;
