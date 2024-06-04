import { configureStore } from "@reduxjs/toolkit";
import mbtiReducer from "./slices/MbtiSlice.tsx";

const store = configureStore({
    reducer: {
        mbti: mbtiReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
