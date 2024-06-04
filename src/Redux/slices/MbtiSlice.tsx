import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MBTIState {
    answers: string[];
    result: string | null;
}

const initialState: MBTIState = {
    answers: [],
    result: null,
};

const mbtiSlice = createSlice({
    name: "mbti",
    initialState,
    reducers: {
        addAnswer: (state, action: PayloadAction<string>) => {
            state.answers.push(action.payload);
        },
        setResult: (state, action: PayloadAction<string>) => {
            state.result = action.payload;
        },
        reset: (state) => {
            state.answers = [];
            state.result = null;
        },
    },
});

export const { addAnswer, setResult, reset } = mbtiSlice.actions;

const calculateMBTI = (answers: string[]) => (dispatch: any) => {
    const typeCount = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    answers.forEach((answer) => {
        typeCount[answer]++;
    });

    const mbtiType =
        (typeCount.E >= typeCount.I ? "E" : "I") +
        (typeCount.S >= typeCount.N ? "S" : "N") +
        (typeCount.T >= typeCount.F ? "T" : "F") +
        (typeCount.J >= typeCount.P ? "J" : "P");

    const ramenRecommendation =
        {
            ENTJ: "왕뚜껑",
            ENTP: "신라면",
            ESTJ: "안성탕면",
            ESFJ: "새우탕",
            ENFJ: "육개장",
            ENFP: "불닭볶음면",
            ESTP: "짜파게티",
            ESFP: "짜왕",
            INTJ: "진라면",
            INTP: "참깨라면",
            INFJ: "비빔면",
            INFP: "사리곰탕",
            ISTJ: "육개장",
            ISFJ: "사리곰탕",
            ISTP: "너구리",
            ISFP: "삼양라면",
        }[mbtiType] || "기본 라면";

    dispatch(setResult(`${mbtiType}: ${ramenRecommendation}`));
};

export { calculateMBTI };
export default mbtiSlice.reducer;
