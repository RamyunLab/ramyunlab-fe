// App.tsx
import React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import MainPage from "./page/MainPage.tsx";
import MbtiPage from "./page/MbtiPage.tsx";
import WorldcupPage from "./page/WorldcupPage.tsx";
import store from "./Redux/store.tsx";
import Footer from "./components/Footer/Footer.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/mbti" element={<MbtiPage />} />
                        <Route path="/worldcup" element={<WorldcupPage />} />
                        <Route path="/" element={<MainPage />} /> {/* MainPage as default */}
                    </Routes>
                    <Footer />
                </Router>
            </QueryClientProvider>
        </Provider>
    );
};

export default App;
