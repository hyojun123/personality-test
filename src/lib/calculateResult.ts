import { questions, Dimension } from "@/data/questions";
import { animals, Animal } from "@/data/animals";

export type Answers = Record<number, number>; // questionId -> answer (1-5)

export interface DimensionScores {
  extroversion: number;
  emotional: number;
  planning: number;
  leadership: number;
  adventure: number;
  independence: number;
}

// 응답을 6차원 점수로 변환
export function calculateDimensionScores(answers: Answers): DimensionScores {
  const scores: DimensionScores = {
    extroversion: 0,
    emotional: 0,
    planning: 0,
    leadership: 0,
    adventure: 0,
    independence: 0,
  };

  const counts: Record<Dimension, number> = {
    extroversion: 0,
    emotional: 0,
    planning: 0,
    leadership: 0,
    adventure: 0,
    independence: 0,
  };

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;

    // 점수 반전 처리 (reversed가 true면 6 - answer)
    const score = question.reversed ? 6 - answer : answer;

    scores[question.dimension] += score;
    counts[question.dimension]++;
  }

  // 평균 계산 (각 차원당 5문항이므로 5로 나눔)
  for (const dimension of Object.keys(scores) as Dimension[]) {
    if (counts[dimension] > 0) {
      scores[dimension] = scores[dimension] / counts[dimension];
    }
  }

  return scores;
}

// 유클리드 거리 계산
function calculateDistance(scores1: DimensionScores, scores2: Record<Dimension, number>): number {
  let sum = 0;
  for (const dimension of Object.keys(scores1) as Dimension[]) {
    const diff = scores1[dimension] - scores2[dimension];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// 가장 유사한 동물 찾기
export function findMatchingAnimal(answers: Answers): Animal {
  const userScores = calculateDimensionScores(answers);

  let bestMatch: Animal = animals[0];
  let minDistance = Infinity;

  for (const animal of animals) {
    const distance = calculateDistance(userScores, animal.scores);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = animal;
    }
  }

  return bestMatch;
}

// 모든 동물과의 유사도 계산 (상위 N개 반환)
export function findTopMatches(answers: Answers, count: number = 3): Array<{ animal: Animal; similarity: number }> {
  const userScores = calculateDimensionScores(answers);

  const matches = animals.map((animal) => {
    const distance = calculateDistance(userScores, animal.scores);
    // 거리를 유사도로 변환 (최대 거리를 기준으로 0-100% 계산)
    // 최대 가능 거리: sqrt(6 * 4^2) = sqrt(96) ≈ 9.8
    const maxDistance = Math.sqrt(96);
    const similarity = Math.max(0, (1 - distance / maxDistance) * 100);
    return { animal, similarity };
  });

  return matches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count);
}

// 가장 맞지 않는 동물 찾기 (하위 N개 반환)
export function findWorstMatches(answers: Answers, count: number = 3): Array<{ animal: Animal; similarity: number }> {
  const userScores = calculateDimensionScores(answers);

  const matches = animals.map((animal) => {
    const distance = calculateDistance(userScores, animal.scores);
    const maxDistance = Math.sqrt(96);
    const similarity = Math.max(0, (1 - distance / maxDistance) * 100);
    return { animal, similarity };
  });

  return matches
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, count);
}
