import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentRamen: null,
    nextRamen: null,
    isGameOver: false,
    message: "",
    roundCount: 0,
    finalRamen: null,
    showScoville: false,
    seenRamen: [], // 초기화된 상태
};

const updownSlice = createSlice({
    name: "updown",
    initialState,
    reducers: {
        setRamen(state, action) {
            state.currentRamen = action.payload.current;
            state.nextRamen = action.payload.next;
        },
        setNextRamen(state, action) {
            state.nextRamen = action.payload;
        },
        setGameOver(state, action) {
            state.isGameOver = true;
            state.finalRamen = action.payload.finalRamen;
            state.message = action.payload.message;
        },
        setMessage(state, action) {
            state.message = action.payload;
        },
        incrementRound(state) {
            state.roundCount += 1;
        },
        resetGame(state) {
            state.currentRamen = null;
            state.nextRamen = null;
            state.isGameOver = false;
            state.message = "";
            state.roundCount = 0;
            state.finalRamen = null;
            state.showScoville = false;
            state.seenRamen = []; // 상태 초기화
        },
        setShowScoville(state, action) {
            state.showScoville = action.payload;
        },
        addSeenRamen(state, action) {
            state.seenRamen.push(action.payload);
        },
    },
});

export const {
    setRamen,
    setNextRamen,
    setGameOver,
    setMessage,
    incrementRound,
    resetGame,
    setShowScoville,
    addSeenRamen,
} = updownSlice.actions;

export default updownSlice.reducer;
