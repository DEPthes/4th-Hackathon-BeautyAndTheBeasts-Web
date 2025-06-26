import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { callGeminiAPI, type TTSOptions } from "../utils/api";
import { useNavigate } from "react-router-dom";
import InputImage from "../assets/images/InputImage.png";
import SubmitButton from "../assets/images/SubmitButton.png";

const InputPage: React.FC = () => {
  const navigate = useNavigate();
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
      alert("칭찬거리를 입력해주세요!");
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
    <Layout
      className="flex flex-col items-center justify-start min-h-screen"
      showFooter={false}
      onBackClick={() => navigate(-1)}
    >
      {/* SVG 이미지와 입력 폼을 담는 컨테이너 */}
      <div className="relative w-full">
        <img
          src={InputImage}
          alt="Input Interface"
          className="w-full pr-6 h-auto"
        />

        {/* SVG 위에 오버레이되는 입력 폼 */}
        <div className="absolute top-9 left-12 flex flex-col items-center justify-start pt-5">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
          >
            {/* 텍스트 입력 영역 - SVG 내부 영역에 맞춤 */}
            <div className="w-full mt-4 px-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= 100) {
                    setInputText(text);
                  }
                }}
                className="w-full h-80 p-3 border-0 bg-transparent text-white placeholder:text-gray-200 placeholder:font-[DungGeunMo] font-[DungGeunMo] resize-none text-xl leading-relaxed focus:outline-none"
                placeholder="칭찬거리 적어달라. |"
                disabled={isLoading}
                maxLength={100}
                style={{
                  fontFamily:
                    "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              />
              {/* 글자수 카운터 */}
              <div className="absolute bottom-5 right-3 text-xl text-gray-300 font-[DungGeunMo]">
                {inputText.length}/100
              </div>
            </div>
          </form>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !inputText.trim()}
        className="mt-3 relative transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
      >
        <img src={SubmitButton} alt="칭찬 착즙하기" className="w-full" />

        {/* 버튼 텍스트 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-red-500 font-[DungGeunMo] text-4xl">
            칭찬 착즙하기
          </span>
        </div>

        {/* 로딩 상태일 때 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
            <div className="flex items-center gap-2 text-white font-[DungGeunMo] text-sm">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              착즙 중...
            </div>
          </div>
        )}
      </button>

      {/* AI 응답 표시 */}
      {response && (
        <div className="mt-8 max-w-md w-full p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
          <h3 className="text-lg font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
            🎭 유병재의 칭찬 메시지
          </h3>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-center text-sm">
              {response}
            </p>
          </div>

          {/* 재생 버튼 */}
          {audioBlob && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handlePlayAudio}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
              >
                <span className="text-base">🎵</span>
                다시 듣기
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default InputPage;
