import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import mbtiReducer from "./slices/MbtiSlice.tsx";
import authReducer from "./slices/AuthSlice.tsx";
import updownReducer from "./slices/UpdownSlice.tsx";

const rootReducer = combineReducers({
    mbti: mbtiReducer,
    auth: authReducer,
    updown: updownReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["updown"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
