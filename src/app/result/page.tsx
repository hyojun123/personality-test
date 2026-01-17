"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { findMatchingAnimal, findTopMatches, calculateDimensionScores, Answers } from "@/lib/calculateResult";
import { dimensionLabels, Dimension } from "@/data/questions";

function ResultContent() {
  const searchParams = useSearchParams();
  const answersParam = searchParams.get("answers");

  if (!answersParam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">결과를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">테스트를 먼저 진행해주세요.</p>
          <Link
            href="/test"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full"
          >
            테스트 시작하기
          </Link>
        </div>
      </div>
    );
  }

  let answers: Answers;
  try {
    answers = JSON.parse(decodeURIComponent(answersParam));
  } catch {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">잘못된 데이터입니다</h1>
          <Link
            href="/test"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full"
          >
            다시 테스트하기
          </Link>
        </div>
      </div>
    );
  }

  const result = findMatchingAnimal(answers);
  const topMatches = findTopMatches(answers, 3);
  const dimensionScores = calculateDimensionScores(answers);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* 메인 결과 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 text-center">
          <div className="text-sm text-purple-500 font-medium mb-2">
            당신과 닮은 동물은
          </div>

          <div className="text-9xl mb-4">
            {result.emoji}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {result.name}
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {result.description}
          </p>

          {/* 특성 태그 */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {result.traits.map((trait) => (
              <span
                key={trait}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* 성격 차원 분석 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            성격 분석 결과
          </h2>

          <div className="space-y-4">
            {(Object.keys(dimensionScores) as Dimension[]).map((dimension) => {
              const score = dimensionScores[dimension];
              const percentage = ((score - 1) / 4) * 100;
              const labels = dimensionLabels[dimension];

              return (
                <div key={dimension}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{labels.low}</span>
                    <span>{labels.high}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 비슷한 동물들 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            비슷한 동물 유형
          </h2>

          <div className="space-y-3">
            {topMatches.map(({ animal, similarity }, index) => (
              <div
                key={animal.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-3xl">{animal.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {index + 1}. {animal.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    유사도 {similarity.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 다시 테스트하기 버튼 */}
        <div className="text-center space-y-4">
          <Link
            href="/test"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            다시 테스트하기
          </Link>

          <div>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              처음으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">🔮</div>
            <p className="text-gray-600">결과를 분석 중입니다...</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
