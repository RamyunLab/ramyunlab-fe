import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
declare global {
    interface Window {
        Kakao: any;
    }
}

// 카카오 SDK가 로드된 후 초기화
const initializeKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_APP_KEY); // 환경 변수에서 앱 키를 불러옵니다.
    }
};

// SDK 로드 상태를 주기적으로 체크하는 함수
const checkKakao = (callback: () => void) => {
    if (window.Kakao) {
        callback();
    } else {
        setTimeout(() => checkKakao(callback), 100);
    }
};

// SDK 초기화
checkKakao(initializeKakao);

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
