import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import MainPage from "./page/MainPage.tsx";
import MbtiPage from "./page/MbtiPage.tsx";
import store from "./Redux/store.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Tournament from "./page/Tournament.tsx";
import LoginModal from "./components/Auth/LoginModal.tsx";
import RegisterModal from "./components/Auth/RegisterModal.tsx";
import RamenDetailPage from "./page/RamenDetailPage.tsx";
import UpDownGamePage from "./page/UpDownGamePage.tsx";
import AccountPage from "./components/AccountModal/AccountPage.tsx";
import FinalScreen from "./page/FinalScreen.tsx";
import FavoriteListPage from "./page/FavoriteListPage.tsx";
import ResultPage from "./page/UpDownGameResultPage.tsx"; // 추가된 ResultPage
import MyReviewsPage from "./page/MyReviewsPage.tsx";
import LikedReviewsPage from "./page/LikedReviewsPage.tsx";
import RecentlyViewed from "./components/RecentlyViewed/RecentlyViewed.tsx";
import LoginToKakao from "./components/Auth/LoginToKakao.tsx";
import NotFoundPage from "./page/404Page.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [nickname, setNickname] = useState<string | null>(null);

    const toggleLoginModal = () => {
        setShowLoginModal((prev) => !prev);
        if (showRegisterModal) {
            setShowRegisterModal(false);
        }
    };

    const toggleRegisterModal = () => {
        setShowRegisterModal((prev) => !prev);
        if (showLoginModal) {
            setShowLoginModal(false);
        }
    };

    const RedirectToMain = () => {
        const navigate = useNavigate();
        useEffect(() => {
            navigate("/main");
        }, [navigate]);
        return null;
    };

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Header toggleLoginModal={toggleLoginModal} updatedNickname={nickname} />
                    <Routes>
                        <Route path="/" element={<RedirectToMain />} />
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/mbti" element={<MbtiPage />} />
                        <Route path="/tournament" element={<Tournament />} />
                        <Route path="/main/ramyun/:ramyunIdx" element={<RamenDetailPage />} />
                        <Route path="/UpDownGame" element={<UpDownGamePage />} />
                        <Route path="/UpDownGame/result" element={<ResultPage />} />
                        <Route
                            path="/main/ramyun/:ramyunIdx/review"
                            element={<RamenDetailPage />}
                        />
                        <Route
                            path="/account"
                            element={<AccountPage onNicknameChange={setNickname} />} // 닉네임 변경 함수 전달
                        />
                        <Route path="/tournament/result/:ramenId" element={<FinalScreen />} />
                        <Route path="/FavoriteListPage" element={<FavoriteListPage />} />
                        <Route path="/MyReviewsPage" element={<MyReviewsPage />} />
                        <Route path="/LikedReviewsPage" element={<LikedReviewsPage />} />
                        <Route path="/recently-viewed" element={<RecentlyViewed />} />
                        <Route path="/loginToKakao" element={<LoginToKakao />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    <Footer />
                </Router>
                {showLoginModal && (
                    <LoginModal
                        toggleLoginModal={toggleLoginModal}
                        toggleRegisterModal={toggleRegisterModal}
                    />
                )}
                {showRegisterModal && (
                    <RegisterModal
                        toggleRegisterModal={toggleRegisterModal}
                        toggleLoginModal={toggleLoginModal}
                    />
                )}
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
