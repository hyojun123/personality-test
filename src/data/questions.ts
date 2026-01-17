export type Dimension =
  | "extroversion"      // 외향성/내향성
  | "emotional"         // 감정적/논리적
  | "planning"          // 계획형/즉흥형
  | "leadership"        // 리더형/협력형
  | "adventure"         // 안정추구/모험추구
  | "independence";     // 독립형/의존형

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  reversed: boolean; // true면 점수 반전 (5->1, 4->2, ...)
}

export const questions: Question[] = [
  // 외향성/내향성 (5문항) - 높은 점수 = 외향적
  {
    id: 1,
    text: "새로운 사람들을 만나는 것이 즐겁다",
    dimension: "extroversion",
    reversed: false,
  },
  {
    id: 2,
    text: "파티나 모임에서 에너지를 얻는다",
    dimension: "extroversion",
    reversed: false,
  },
  {
    id: 3,
    text: "혼자 있는 시간이 꼭 필요하다",
    dimension: "extroversion",
    reversed: true,
  },
  {
    id: 4,
    text: "대화를 먼저 시작하는 편이다",
    dimension: "extroversion",
    reversed: false,
  },
  {
    id: 5,
    text: "조용한 환경에서 더 집중이 잘 된다",
    dimension: "extroversion",
    reversed: true,
  },

  // 감정적/논리적 (5문항) - 높은 점수 = 감정적
  {
    id: 6,
    text: "결정을 내릴 때 감정을 중요하게 고려한다",
    dimension: "emotional",
    reversed: false,
  },
  {
    id: 7,
    text: "다른 사람의 감정에 쉽게 공감한다",
    dimension: "emotional",
    reversed: false,
  },
  {
    id: 8,
    text: "논리와 사실에 기반해 판단하는 것이 옳다고 생각한다",
    dimension: "emotional",
    reversed: true,
  },
  {
    id: 9,
    text: "감동적인 영화나 이야기에 눈물을 흘리는 편이다",
    dimension: "emotional",
    reversed: false,
  },
  {
    id: 10,
    text: "객관적인 분석이 직감보다 중요하다",
    dimension: "emotional",
    reversed: true,
  },

  // 계획형/즉흥형 (5문항) - 높은 점수 = 계획형
  {
    id: 11,
    text: "일정을 미리 계획하는 것을 좋아한다",
    dimension: "planning",
    reversed: false,
  },
  {
    id: 12,
    text: "갑작스러운 변화가 불편하다",
    dimension: "planning",
    reversed: false,
  },
  {
    id: 13,
    text: "즉흥적인 여행을 떠나는 것이 재미있다",
    dimension: "planning",
    reversed: true,
  },
  {
    id: 14,
    text: "할 일 목록을 작성하고 체크하는 것을 좋아한다",
    dimension: "planning",
    reversed: false,
  },
  {
    id: 15,
    text: "마감 직전에 일을 처리하는 경우가 많다",
    dimension: "planning",
    reversed: true,
  },

  // 리더형/협력형 (5문항) - 높은 점수 = 리더형
  {
    id: 16,
    text: "그룹에서 자연스럽게 리더 역할을 맡게 된다",
    dimension: "leadership",
    reversed: false,
  },
  {
    id: 17,
    text: "의견이 다를 때 내 주장을 강하게 펼친다",
    dimension: "leadership",
    reversed: false,
  },
  {
    id: 18,
    text: "다른 사람의 의견을 따르는 것이 편하다",
    dimension: "leadership",
    reversed: true,
  },
  {
    id: 19,
    text: "중요한 결정은 내가 직접 내리고 싶다",
    dimension: "leadership",
    reversed: false,
  },
  {
    id: 20,
    text: "팀에서 조화를 유지하는 것이 가장 중요하다",
    dimension: "leadership",
    reversed: true,
  },

  // 안정추구/모험추구 (5문항) - 높은 점수 = 모험추구
  {
    id: 21,
    text: "새로운 도전을 하는 것이 두렵지 않다",
    dimension: "adventure",
    reversed: false,
  },
  {
    id: 22,
    text: "안정적인 직장이 모험적인 기회보다 좋다",
    dimension: "adventure",
    reversed: true,
  },
  {
    id: 23,
    text: "익숙하지 않은 음식도 기꺼이 먹어본다",
    dimension: "adventure",
    reversed: false,
  },
  {
    id: 24,
    text: "위험을 감수하더라도 새로운 경험을 추구한다",
    dimension: "adventure",
    reversed: false,
  },
  {
    id: 25,
    text: "예측 가능한 일상이 편안하다",
    dimension: "adventure",
    reversed: true,
  },

  // 독립형/의존형 (5문항) - 높은 점수 = 독립형
  {
    id: 26,
    text: "혼자서 문제를 해결하는 것을 선호한다",
    dimension: "independence",
    reversed: false,
  },
  {
    id: 27,
    text: "중요한 결정 전에 주변 사람들의 조언을 구한다",
    dimension: "independence",
    reversed: true,
  },
  {
    id: 28,
    text: "다른 사람의 도움 없이도 잘 해낼 수 있다",
    dimension: "independence",
    reversed: false,
  },
  {
    id: 29,
    text: "함께 일할 때 더 좋은 결과가 나온다",
    dimension: "independence",
    reversed: true,
  },
  {
    id: 30,
    text: "나만의 방식대로 일하는 것이 효율적이다",
    dimension: "independence",
    reversed: false,
  },
];

export const dimensionLabels: Record<Dimension, { high: string; low: string }> = {
  extroversion: { high: "외향적", low: "내향적" },
  emotional: { high: "감정적", low: "논리적" },
  planning: { high: "계획형", low: "즉흥형" },
  leadership: { high: "리더형", low: "협력형" },
  adventure: { high: "모험추구", low: "안정추구" },
  independence: { high: "독립형", low: "의존형" },
};
