import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { callGeminiAPI, type TTSOptions } from "../utils/api";

const InputPage: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(undefined);

  // 유병재 목소리 고정 설정 (자연스러운 남성 목소리 유지)
  const voiceSettings: TTSOptions = {
    voice: "유병재",
    language: "ko",
    speed: 1.0,
    emotion: {
      happiness: 0.6, // 0.8 → 0.6 (과도한 행복감 조절)
      surprise: 0.2, // 0.3 → 0.2 (과도한 놀라움 조절)
      other: 0.2, // 기타 감정 조금 증가
    },
    pitch_std: 25.0, // 45.0 → 25.0 (남성 목소리 유지)
    speaking_rate: 17.0, // 16.0 → 17.0 (자연스러운 속도)
  };

  // 음성 처리 및 재생 함수 (로컬 구현)
  const processTextAndPlay = async (text: string, options: TTSOptions) => {
    const { convertTextToSpeech } = await import("../utils/api");
    const audioBlob = await convertTextToSpeech(text, options);

    // 오디오 URL 생성 및 재생
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(audioUrl);
    });

    await audio.play();
    return audioBlob;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      alert("텍스트를 입력해주세요!");
      return;
    }

    console.log("📝 제출된 텍스트:", inputText);
    console.log("🎭 유병재 목소리로 변환 예정");
    setIsLoading(true);

    try {
      // Gemini API 호출
      console.log("🤖 Gemini API 호출 중...");
      const geminiResponse = await callGeminiAPI(inputText);
      console.log("✅ Gemini 응답 받음:", geminiResponse.gptResponse);
      setResponse(geminiResponse.gptResponse);

      // TTS 변환 및 재생 (유병재 목소리)
      console.log("🎤 유병재 목소리로 TTS 변환 및 재생 시작...");
      const blob = await processTextAndPlay(
        geminiResponse.gptResponse,
        voiceSettings
      );
      setAudioBlob(blob);
      console.log("✅ 모든 처리 완료");
    } catch (error) {
      console.error("❌ 처리 중 오류:", error);
      alert(
        `오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!audioBlob) {
      alert("재생할 음성이 없습니다!");
      return;
    }

    try {
      console.log("🔄 기존 생성된 유병재 음성을 재생합니다...");
      // 기존에 생성된 audioBlob을 재생 (새로 생성하지 않음)
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl);
      });

      await audio.play();
      console.log("✅ 음성 재생 완료");
    } catch (error) {
      console.error("❌ 음성 재생 실패:", error);
      alert("음성 재생에 실패했습니다.");
    }
  };

  return (
    <Layout className="flex flex-col p-4 gap-4">
      {/* 메인 콘텐츠 래퍼 - 반투명 배경 추가 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎭 AI 일기 분석 & 유병재 목소리 변환
          </h1>
          <p className="text-gray-600">
            오늘 하루를 입력하면 AI가 분석하고 유병재님 목소리로 들려드려요!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 오늘 하루 일기 작성
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl placeholder:text-gray-400 resize-none h-40 bg-white/95 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="오늘 하루 어떤 일이 있었는지 자유롭게 써보세요...&#10;예: 오늘은 친구와 맛있는 음식을 먹었어요. 정말 즐거운 하루였습니다!"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                🎭 유병재 목소리로 변환 중...
              </>
            ) : (
              <>
                <span className="text-xl">🎭</span>
                AI 분석 & 유병재 목소리로 듣기
              </>
            )}
          </button>
        </form>

        {/* AI 응답 표시 */}
        {response && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              🤖 AI 분석 결과
              <span className="text-sm font-normal text-gray-600">
                (유병재 목소리로 재생됨)
              </span>
            </h3>
            <div className="bg-white/80 rounded-lg p-4 border border-white/50">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {response}
              </p>
            </div>

            {/* 재생 버튼만 표시 (다운로드 제거) */}
            {audioBlob && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handlePlayAudio}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
                >
                  <span className="text-lg">🎵</span>
                  다시 재생하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 안내 섹션들도 반투명 배경 적용 */}
      <div className="bg-purple-50/90 backdrop-blur-sm border border-purple-200 rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
          🎭 유병재 목소리 TTS 서비스
        </h4>
        <ol className="text-sm text-purple-700 space-y-1">
          <li>1. 오늘 하루 있었던 일을 자유롭게 작성해주세요</li>
          <li>2. AI가 당신의 일기를 따뜻하게 분석해드립니다</li>
          <li>3. 분석 결과를 유병재님의 목소리로 자동 재생합니다</li>
          <li>4. 다시 듣고 싶으면 "다시 재생하기" 버튼을 누르세요</li>
        </ol>
      </div>

      <div className="bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-xl p-4 shadow-sm">
        <p className="text-sm text-green-700 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span>
            <span className="font-semibold">유병재 음성 적용됨:</span>
            실제 유병재님의 음성 샘플(극한의 넌센스 공작소.mp3)을 사용하여
            고품질 음성 복제가 적용되었습니다.
          </span>
        </p>
      </div>

      <div className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-200 rounded-xl p-3 shadow-sm">
        <p className="text-sm text-yellow-700 flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <span>
            <span className="font-semibold">서버 상태:</span>
            Zonos TTS 서버가 localhost:8000에서 실행 중이어야 합니다.
          </span>
        </p>
      </div>
    </Layout>
  );
};

export default InputPage;
