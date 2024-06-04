import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MBTIState {
    answers: string[];
    result: { mbtiType: string; ramenRecommendation: string; description: string } | null;
    showResult: boolean;
}

const initialState: MBTIState = {
    answers: [],
    result: null,
    showResult: false,
};

const mbtiSlice = createSlice({
    name: "mbti",
    initialState,
    reducers: {
        addAnswer: (state, action: PayloadAction<string>) => {
            state.answers.push(action.payload);
        },
        setResult: (
            state,
            action: PayloadAction<{
                mbtiType: string;
                ramenRecommendation: string;
                description: string;
            }>
        ) => {
            state.result = action.payload;
            state.showResult = true;
        },
        resetResult: (state) => {
            state.result = null;
            state.answers = [];
            state.showResult = false;
        },
    },
});
export const { addAnswer, setResult, resetResult } = mbtiSlice.actions;

const questionsCount = 4; // 질문의 수를 정의합니다.

const calculateMBTI = (answers: string[]) => (dispatch: any) => {
    console.log("Calculating MBTI with answers:", answers);
    const typeCount = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    answers.forEach((answer) => {
        typeCount[answer]++;
    });

    const mbtiType =
        (typeCount.E >= typeCount.I ? "E" : "I") +
        (typeCount.S >= typeCount.N ? "S" : "N") +
        (typeCount.T >= typeCount.F ? "T" : "F") +
        (typeCount.J >= typeCount.P ? "J" : "P");

    console.log("Determined MBTI type:", mbtiType);
    const ramenRecommendationMap = {
        ENTJ: {
            ramen: "왕뚜껑",
            description:
                "지도자형인 ENTJ는 강력하고 도전적인 성격을 가지고 있으며, 왕뚜껑 라면은 그들의 강한 리더십과 잘 맞습니다.",
        },
        ENTP: {
            ramen: "신라면",
            description:
                "창의적이고 호기심 많은 ENTP는 새로운 경험을 즐기며, 신라면의 매운맛과 새로운 도전이 그들에게 잘 어울립니다.",
        },
        ESTJ: {
            ramen: "안성탕면",
            description:
                "실용적이고 조직적인 ESTJ는 전통과 규칙을 중요시하며, 안성탕면의 안정적이고 전통적인 맛을 선호합니다.",
        },
        ESFJ: {
            ramen: "새우탕",
            description:
                "따뜻하고 친근한 ESFJ는 사람들과의 교류를 즐기며, 새우탕 라면의 풍부한 맛과 따뜻한 느낌이 잘 맞습니다.",
        },
        ENFJ: {
            ramen: "육개장",
            description:
                "카리스마 넘치는 ENFJ는 사람들을 돕는 것을 좋아하며, 육개장의 강렬하고 따뜻한 맛이 그들에게 잘 어울립니다.",
        },
        ENFP: {
            ramen: "불닭볶음면",
            description:
                "자유롭고 열정적인 ENFP는 독창적이고 개성 있는 것을 좋아하며, 불닭볶음면의 매운맛과 독특함을 즐깁니다.",
        },
        ESTP: {
            ramen: "짜파게티",
            description:
                "모험적이고 즉흥적인 ESTP는 다양한 맛을 시도하는 것을 좋아하며, 짜파게티의 독특한 맛과 편리함이 잘 맞습니다.",
        },
        ESFP: {
            ramen: "짜왕",
            description:
                "사교적이고 활기찬 ESFP는 사람들과 함께하는 것을 즐기며, 짜왕의 풍부한 맛과 인기를 누리는 것을 좋아합니다.",
        },
        INTJ: {
            ramen: "진라면",
            description:
                "전략적이고 분석적인 INTJ는 깊이 있는 사고를 좋아하며, 진라면의 깊은 맛과 균형이 잘 어울립니다.",
        },
        INTP: {
            ramen: "참깨라면",
            description:
                "논리적이고 호기심 많은 INTP는 새로운 아이디어를 탐구하며, 참깨라면의 고소하고 독특한 맛을 즐깁니다.",
        },
        INFJ: {
            ramen: "비빔면",
            description:
                "직관적이고 통찰력 있는 INFJ는 깊이 있는 의미를 찾으며, 비빔면의 매콤달콤한 맛과 어울립니다.",
        },
        INFP: {
            ramen: "사리곰탕",
            description:
                "이상적이고 감성적인 INFP는 깊은 감정을 느끼며, 사리곰탕의 부드럽고 따뜻한 맛을 좋아합니다.",
        },
        ISTJ: {
            ramen: "육개장",
            description:
                "신뢰할 수 있고 실용적인 ISTJ는 전통적인 가치를 중요시하며, 육개장의 전통적이고 강렬한 맛을 선호합니다.",
        },
        ISFJ: {
            ramen: "사리곰탕",
            description:
                "헌신적이고 책임감 있는 ISFJ는 다른 사람을 돌보는 것을 좋아하며, 사리곰탕의 부드럽고 따뜻한 맛이 잘 어울립니다.",
        },
        ISTP: {
            ramen: "너구리",
            description:
                "분석적이고 문제 해결 능력이 뛰어난 ISTP는 효율적이고 실용적인 것을 좋아하며, 너구리의 쫄깃한 면발과 깊은 맛을 즐깁니다.",
        },
        ISFP: {
            ramen: "삼양라면",
            description:
                "예술적이고 감성적인 ISFP는 아름다움과 감성을 중요시하며, 삼양라면의 클래식하고 친근한 맛을 선호합니다.",
        },
    };

    const recommendation = ramenRecommendationMap[mbtiType] || {
        ramen: "기본 라면",
        description: "기본적인 맛의 라면입니다.",
    };

    dispatch(
        setResult({
            mbtiType,
            ramenRecommendation: recommendation.ramen,
            description: recommendation.description,
        })
    );
};

export { calculateMBTI, questionsCount };
export default mbtiSlice.reducer;
