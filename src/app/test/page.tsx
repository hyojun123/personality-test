"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/data/questions";
import { Answers } from "@/lib/calculateResult";

const answerLabels = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "매우 그렇다" },
];

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      // 다음 질문으로
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 200);
    } else {
      // 모든 질문 완료 - 결과 페이지로 이동
      const encodedAnswers = encodeURIComponent(JSON.stringify(newAnswers));
      router.push(`/result?answers=${encodedAnswers}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center p-4 sm:p-8">
      <div className="max-w-lg w-full">
        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>질문 {currentIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-6xl text-center mb-6">
            {getQuestionEmoji(currentIndex)}
          </div>

          <h2 className="text-xl sm:text-2xl font-medium text-gray-800 text-center mb-8 leading-relaxed">
            {currentQuestion.text}
          </h2>

          {/* 답변 버튼들 */}
          <div className="space-y-3">
            {answerLabels.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`w-full py-4 px-6 rounded-xl text-left transition-all duration-200 ${
                  answers[currentQuestion.id] === value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                <span className="font-medium">{value}.</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* 이전 버튼 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 이전 질문으로
          </button>
        )}
      </div>
    </main>
  );
}

// 질문 인덱스에 따른 이모지 반환
function getQuestionEmoji(index: number): string {
  const emojis = [
    "🎉", "🎊", "🌟", "💫", "✨",
    "💭", "💡", "🧠", "💝", "🎯",
    "📋", "⏰", "🗓️", "✅", "🏃",
    "👑", "💪", "🤝", "🎖️", "🌈",
    "🚀", "🏠", "🍜", "⛰️", "🛋️",
    "🔧", "🗣️", "💎", "👥", "🎨",
  ];
  return emojis[index % emojis.length];
}
