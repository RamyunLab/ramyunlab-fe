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

const queryClient = new QueryClient();

const App: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

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
                    <Header toggleLoginModal={toggleLoginModal} />
                    <Routes>
                        <Route path="/" element={<RedirectToMain />} />
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/mbti" element={<MbtiPage />} />
                        <Route path="/tournament" element={<Tournament />} />
                        <Route path="/ramen/:idx" element={<RamenDetailPage />} />
                        <Route path="/UpDownGame" element={<UpDownGamePage />} />
                        <Route path="/UpDownGame/result" element={<ResultPage />} />{" "}
                        {/* 추가된 경로 */}
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/tournament/result/:ramenId" element={<FinalScreen />} />
                        <Route path="/FavoriteListPage" element={<FavoriteListPage />} />
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
