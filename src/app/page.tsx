import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl mb-6">
          🦁🐬🦊
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          나와 닮은 동물은?
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          30개의 질문을 통해 당신의 성격을 분석하고,
          <br />
          20가지 동물 유형 중 가장 닮은 동물을 찾아드립니다.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            테스트 안내
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-purple-500">✓</span>
              총 30문항으로 구성되어 있습니다
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-500">✓</span>
              각 문항에 1~5점으로 답해주세요
            </li>
            <li className="flex items-center gap-2">
              <span className="text-purple-500">✓</span>
              솔직하게 답할수록 정확한 결과가 나옵니다
            </li>
          </ul>
        </div>

        <Link
          href="/test"
          className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          테스트 시작하기
        </Link>
      </div>
    </main>
  );
}
