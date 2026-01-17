"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { findMatchingAnimal, findTopMatches, findWorstMatches, calculateDimensionScores, Answers } from "@/lib/calculateResult";
import { dimensionLabels, Dimension } from "@/data/questions";
import { Animal } from "@/data/animals";

interface ShareButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function ShareButton({ onClick, children, className = "" }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
}

interface ShareSectionProps {
  result: Animal;
  answers: Answers;
}

function ShareSection({ result, answers }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // 클라이언트에서 현재 URL을 그대로 공유 URL로 사용
    setShareUrl(window.location.href);
  }, []);

  const shareText = `나는 ${result.emoji} ${result.name} 유형이래요! 동물 성격 테스트로 나의 성격 유형을 알아보세요!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareToKakao = () => {
    if (typeof window !== "undefined" && (window as unknown as { Kakao?: { Share?: { sendDefault: (options: unknown) => void } } }).Kakao?.Share) {
      const baseUrl = shareUrl.split("/result")[0];
      (window as unknown as { Kakao: { Share: { sendDefault: (options: unknown) => void } } }).Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나의 동물 성격 유형: ${result.emoji} ${result.name}`,
          description: result.description.slice(0, 100) + "...",
          imageUrl: "",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "결과 확인하기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          {
            title: "나도 테스트하기",
            link: {
              mobileWebUrl: baseUrl + "/test",
              webUrl: baseUrl + "/test",
            },
          },
        ],
      });
    } else {
      alert("카카오 공유 기능을 사용하려면 카카오 SDK 설정이 필요합니다.");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `동물 성격 테스트 결과: ${result.emoji} ${result.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
        결과 공유하기
      </h2>

      {!showShareMenu ? (
        <div className="flex justify-center gap-3">
          <ShareButton
            onClick={shareNative}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white flex-1 max-w-[200px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            공유하기
          </ShareButton>
          <ShareButton
            onClick={copyToClipboard}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                복사됨!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                링크 복사
              </>
            )}
          </ShareButton>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ShareButton
              onClick={shareToTwitter}
              className="bg-black text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </ShareButton>
            <ShareButton
              onClick={shareToFacebook}
              className="bg-[#1877f2] text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </ShareButton>
            <ShareButton
              onClick={shareToKakao}
              className="bg-[#fee500] text-[#3c1e1e]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.592 1.673 4.87 4.204 6.152-.162.582-.537 2.117-.616 2.443-.096.402.147.398.31.289.128-.085 2.039-1.376 2.865-1.937.736.102 1.49.153 2.237.153 5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
              </svg>
              카카오톡
            </ShareButton>
            <ShareButton
              onClick={copyToClipboard}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </ShareButton>
          </div>
          <button
            onClick={() => setShowShareMenu(false)}
            className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

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
  const worstMatches = findWorstMatches(answers, 3);
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

        {/* 잘 맞는 동물들 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-500">💚</span> 잘 맞는 동물 유형
          </h2>
          <p className="text-sm text-gray-500 mb-4">성격이 비슷해서 잘 통하는 동물들이에요</p>

          <div className="space-y-3">
            {topMatches.map(({ animal, similarity }, index) => (
              <div
                key={animal.id}
                className="flex items-center gap-4 p-3 bg-green-50 rounded-xl border border-green-100"
              >
                <span className="text-3xl">{animal.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {index + 1}. {animal.name}
                  </div>
                  <div className="text-sm text-green-600">
                    궁합 {similarity.toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 안 맞는 동물들 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-red-400">💔</span> 안 맞는 동물 유형
          </h2>
          <p className="text-sm text-gray-500 mb-4">성격이 달라서 서로 이해하기 어려울 수 있어요</p>

          <div className="space-y-3">
            {worstMatches.map(({ animal, similarity }, index) => (
              <div
                key={animal.id}
                className="flex items-center gap-4 p-3 bg-red-50 rounded-xl border border-red-100"
              >
                <span className="text-3xl">{animal.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {index + 1}. {animal.name}
                  </div>
                  <div className="text-sm text-red-500">
                    궁합 {similarity.toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 공유하기 */}
        <ShareSection result={result} answers={answers} />

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
