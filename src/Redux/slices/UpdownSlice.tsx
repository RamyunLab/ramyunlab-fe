// Redux/slices/updownSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Ramen {
    r_idx: number;
    r_name: string;
    r_img: string;
    r_scoville: number;
}

interface GameState {
    currentRamen: Ramen | null;
    nextRamen: Ramen | null;
    isGameOver: boolean;
    message: string;
    roundCount: number;
    finalRamen: Ramen | null;
    showScoville: boolean;
}

const initialState: GameState = {
    currentRamen: null,
    nextRamen: null,
    isGameOver: false,
    message: "",
    roundCount: 0,
    finalRamen: null,
    showScoville: false,
};

const updownSlice = createSlice({
    name: "updown",
    initialState,
    reducers: {
        setRamen(state, action: PayloadAction<{ current: Ramen; next: Ramen }>) {
            state.currentRamen = action.payload.current;
            state.nextRamen = action.payload.next;
        },
        setNextRamen(state, action: PayloadAction<Ramen>) {
            state.nextRamen = action.payload;
        },
        setGameOver(state, action: PayloadAction<{ finalRamen: Ramen | null; message: string }>) {
            state.isGameOver = true;
            state.finalRamen = action.payload.finalRamen;
            state.message = action.payload.message;
        },
        setMessage(state, action: PayloadAction<string>) {
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
        },
        setShowScoville(state, action: PayloadAction<boolean>) {
            state.showScoville = action.payload;
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
} = updownSlice.actions;

export default updownSlice.reducer;
