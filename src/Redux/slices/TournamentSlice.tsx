import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameDTO } from "../../types";

interface TournamentState {
    round: number | null;
    currentMatchups: GameDTO[];
    winners: GameDTO[];
    champion: GameDTO | null;
    currentMatchIndex: number;
}

const initialState: TournamentState = {
    round: null,
    currentMatchups: [],
    winners: [],
    champion: null,
    currentMatchIndex: 0,
};

const tournamentSlice = createSlice({
    name: "tournament",
    initialState,
    reducers: {
        setRound(state, action: PayloadAction<number>) {
            state.round = action.payload;
        },
        setCurrentMatchups(state, action: PayloadAction<GameDTO[]>) {
            state.currentMatchups = action.payload;
        },
        addWinner(state, action: PayloadAction<GameDTO>) {
            state.winners.push(action.payload);
        },
        clearWinners(state) {
            state.winners = [];
        },
        setChampion(state, action: PayloadAction<GameDTO | null>) {
            state.champion = action.payload;
        },
        setCurrentMatchIndex(state, action: PayloadAction<number>) {
            state.currentMatchIndex = action.payload;
        },
        resetTournament(state) {
            state.round = null;
            state.currentMatchups = [];
            state.winners = [];
            state.champion = null;
            state.currentMatchIndex = 0;
        },
    },
});

export const {
    setRound,
    setCurrentMatchups,
    addWinner,
    clearWinners,
    setChampion,
    setCurrentMatchIndex,
    resetTournament,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
