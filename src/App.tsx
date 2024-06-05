// App.tsx
import React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import MainPage from "./page/MainPage.tsx";
import MbtiPage from "./page/MbtiPage.tsx";
import store from "./Redux/store.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Tournament from "./page/Tournament.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/mbti" element={<MbtiPage />} />
                        <Route path="/" element={<MainPage />} /> {/* MainPage as default */}
                        <Route path="/tournament" element={<Tournament />} />
                    </Routes>
                    <Footer />
                </Router>
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
