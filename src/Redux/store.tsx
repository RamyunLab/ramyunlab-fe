import { configureStore } from "@reduxjs/toolkit";
import mbtiReducer from "./slices/MbtiSlice.tsx";
import authReducer from "./slices/AuthSlice.tsx";
const store = configureStore({
    reducer: {
        mbti: mbtiReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
