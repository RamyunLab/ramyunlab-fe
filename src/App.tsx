import React, { useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AccountModal from "./components/AccountModal/AccountModal.tsx"; // AccountModal 추가

const queryClient = new QueryClient();

const App: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

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

    const toggleAccountModal = () => {
        setShowAccountModal((prev) => !prev);
    };

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Header
                        toggleLoginModal={toggleLoginModal}
                        toggleAccountModal={toggleAccountModal}
                    />{" "}
                    {/* Modify this line */}
                    <Routes>
                        <Route path="/mbti" element={<MbtiPage />} />
                        <Route path="/" element={<MainPage />} />
                        <Route path="/tournament" element={<Tournament />} />
                        <Route path="/ramen/:idx" element={<RamenDetailPage />} />
                        <Route path="/UpDownGame" element={<UpDownGamePage />} />
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
                {showAccountModal && (
                    <AccountModal isOpen={showAccountModal} onClose={toggleAccountModal} />
                )}
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
