import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MBTIState {
    answers: string[];
    result: {
        mbtiType: string;
        ramenRecommendation: string;
        description: string;
        imageUrl: string;
    } | null;
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
                imageUrl: string;
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

const questionsCount = 8; // 질문의 수를 8로 정의합니다.

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

    const ramenRecommendationMap = {
        ENTJ: {
            ramen: "왕뚜껑",
            description:
                "지도자형인 ENTJ는 강력하고 도전적인 성격을 가지고 있습니다. 이들은 목표를 설정하고 이를 달성하기 위해 끊임없이 노력하는 성향을 가지고 있으며, 왕뚜껑 라면은 그들의 강한 리더십과 잘 맞습니다. 왕뚜껑의 큰 사이즈와 진한 국물은 ENTJ의 강력한 성격을 대변하며, 그들의 활동적인 라이프스타일에 필요한 에너지를 제공합니다.",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/팔도_왕뚜껑.png",
        },
        ENTP: {
            ramen: "신라면",
            description:
                "창의적이고 호기심 많은 ENTP는 새로운 경험을 즐기는 성향을 가지고 있습니다. 신라면의 매운맛과 도전적인 맛은 ENTP의 모험심과 잘 어울립니다. 이들은 항상 새로운 아이디어와 도전을 추구하며, 신라면의 강렬한 맛은 그들의 도전 정신을 자극합니다. 또한, 신라면은 다양한 재료와 조합하여 먹을 수 있어 ENTP의 창의성을 발휘할 수 있는 완벽한 선택입니다.",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_신라면.jpg",
        },
        ESTJ: {
            ramen: "안성탕면",
            description:
                "실용적이고 조직적인 ESTJ는 전통과 규칙을 중요시하는 성향을 가지고 있습니다. 이들은 실용적이고 효과적인 선택을 선호하며, 안성탕면은 언제나 일관된 맛과 품질을 제공하여 그들의 기대를 충족시킵니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_안성탕면.jpg",
        },
        ESFJ: {
            ramen: "새우탕",
            description:
                "따뜻하고 친근한 ESFJ는 사람들과의 교류를 즐기는 성향을 가지고 있습니다. 새우탕 라면의 풍부한 맛과 따뜻한 느낌은 ESFJ의 따뜻한 성격과 잘 맞습니다. 이들은 다른 사람들과 함께하는 시간을 소중히 여기며, 새우탕의 깊고 진한 맛은 그들에게 편안함과 만족감을 줍니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_새우탕큰사발.jpg",
        },
        ENFJ: {
            ramen: "열라면",
            description:
                "카리스마 넘치는 ENFJ는 사람들을 돕는 것을 좋아하는 성향을 가지고 있습니다. 열라면의 강렬하고 따뜻한 맛은 ENFJ의 이러한 성향과 잘 어울립니다. 이들은 다른 사람들을 이끌고 동기를 부여하는 능력이 뛰어나며, 열라면의 매운맛은 그들의 열정적인 성격을 잘 반영합니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/오뚜기_열라면.webp",
        },
        ENFP: {
            ramen: "불닭볶음면",
            description:
                " 불닭볶음면의 매운맛과 독특함은 ENFP의 이러한 성향과 잘 어울립니다. 이들은 새로운 경험과 도전을 즐기며, 불닭볶음면의 강렬한 맛은 그들의 모험심을 자극합니다. 또한, 불닭볶음면은 다양한 조합으로 즐길 수 있어 ENFP의 창의성과 개성을 표현할 수 있는 완벽한 선택입니다.",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/삼양_불닭볶음면.jpg",
        },
        ESTP: {
            ramen: "짜파게티",
            description:
                "모험적이고 즉흥적인 ESTP는 다양한 맛을 시도하는 것을 좋아합니다. 이들은 언제나 새로운 경험을 추구하며, 짜파게티의 짭짤하고 고소한 맛은 그들의 모험심을 만족시킵니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_올리브%20짜파게티.jpg",
        },
        ESFP: {
            ramen: "짜왕",
            description:
                "사교적이고 활기찬 ESFP는 사람들과 함께하는 것을 즐깁니다. 짜왕의 풍부한 맛과 인기는 ESFP의 이러한 성향과 잘 어울립니다. 이들은 다른 사람들과의 교류를 즐기며, 짜왕의 깊고 진한 맛은 그들에게 큰 만족감을 줍니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_짜왕.jpg",
        },
        INTJ: {
            ramen: "진라면",
            description:
                "전략적이고 분석적인 INTJ는 깊이 있는 사고를 좋아합니다. 진라면의 깊은 맛과 균형은 INTJ의 이러한 성향과 잘 어울립니다. 이들은 항상 목표를 설정하고 이를 달성하기 위해 계획을 세우며, 진라면의 진하고 균형 잡힌 맛은 그들의 철저한 계획성과 잘 맞습니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/오뚜기_진라면%20매운맛.jpg",
        },
        INTP: {
            ramen: "참깨라면",
            description:
                "논리적이고 호기심 많은 INTP는 새로운 아이디어를 탐구하는 것을 좋아합니다. 참깨라면의 고소하고 독특한 맛은 INTP의 이러한 성향과 잘 어울립니다. 이들은 언제나 새로운 지식을 탐구하며, 참깨라면의 고소한 맛은 그들의 호기심을 자극합니다.",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/오뚜기_참깨라면.jpg",
        },
        INFJ: {
            ramen: "팔도 비빔면",
            description:
                "직관적이고 통찰력 있는 INFJ는 깊이 있는 의미를 찾는 성향을 가지고 있습니다. 비빔면의 매콤달콤한 맛은 INFJ의 이러한 성향과 잘 어울립니다. 이들은 항상 의미 있는 대화를 추구하며, 비빔면의 복잡하고 다채로운 맛은 그들의 깊이 있는 사고를 자극합니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/팔도_팔도%20비빔면.png",
        },
        INFP: {
            ramen: "사리곰탕",
            description:
                "이상적이고 감성적인 INFP는 깊은 감정을 느끼는 성향을 가지고 있습니다. 사리곰탕의 부드럽고 따뜻한 맛은 INFP의 이러한 성향과 잘 어울립니다. 이들은 언제나 감정적인 경험을 추구하며, 사리곰탕의 부드럽고 진한 맛은 그들의 감성을 자극합니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_사리곰탕면.jpg",
        },
        ISTJ: {
            ramen: "육개장",
            description:
                "신뢰할 수 있고 실용적인 ISTJ는 전통적인 가치를 중요시하는 성향을 가지고 있습니다. 육개장의 전통적이고 강렬한 맛은 ISTJ의 이러한 성향과 잘 어울립니다. 이들은 언제나 신뢰할 수 있는 선택을 선호하며, 육개장의 깊고 진한 맛은 그들의 기대를 충족시킵니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_육개장%20사발면.jpg",
        },
        ISFJ: {
            ramen: "사리곰탕면",
            description:
                "헌신적이고 책임감 있는 ISFJ는 다른 사람을 돌보는 것을 좋아하는 성향을 가지고 있습니다. 사리곰탕의 부드럽고 따뜻한 맛은 ISFJ의 이러한 성향과 잘 어울립니다. 이들은 항상 다른 사람을 돕고자 하며, 사리곰탕의 부드럽고 진한 맛은 그들의 따뜻한 마음을 반영합니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_사리곰탕면.jpg",
        },
        ISTP: {
            ramen: "너구리",
            description:
                "분석적이고 문제 해결 능력이 뛰어난 ISTP는 효율적이고 실용적인 것을 좋아합니다. 너구리의 쫄깃한 면발과 깊은 맛은 ISTP의 이러한 성향과 잘 어울립니다. 이들은 언제나 문제를 해결하는 데 집중하며, 너구리의 깊고 진한 맛은 그들의 기대를 충족시킵니다. ",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/농심_순한너구리.jpg",
        },
        ISFP: {
            ramen: "삼양라면",
            description:
                "예술적이고 감성적인 ISFP는 아름다움과 감성을 중요시하는 성향을 가지고 있습니다. 삼양라면의 클래식하고 친근한 맛은 ISFP의 이러한 성향과 잘 어울립니다.",
            imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/삼양_삼양라면.jpg",
        },
    };

    const recommendation = ramenRecommendationMap[mbtiType] || {
        ramen: "기본 라면",
        description: "기본적인 맛의 라면입니다.",
        imageUrl: "https://dc7ne3bdq944q.cloudfront.net/img/ramyun/default_ramen.jpg",
    };

    dispatch(
        setResult({
            mbtiType,
            ramenRecommendation: recommendation.ramen,
            description: recommendation.description,
            imageUrl: recommendation.imageUrl,
        })
    );
};

export { calculateMBTI, questionsCount };
export default mbtiSlice.reducer;
