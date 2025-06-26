import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { callGeminiAPI } from "../utils/api";
import { useNavigate } from "react-router-dom";
import InputImage from "../assets/images/InputImage.png";
import SubmitButton from "../assets/images/SubmitButton.png";

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      alert("칭찬거리를 입력해주세요!");
      return;
    }

    console.log("📝 제출된 텍스트:", inputText);
    console.log("🤖 OpenAI TTS로 변환 예정");
    setIsLoading(true);

    try {
      // Gemini API 호출
      console.log("🤖 Gemini API 호출 중...");
      const geminiResponse = await callGeminiAPI(inputText);
      console.log("✅ Gemini 응답 받음:", geminiResponse.gptResponse);

      // OpenAI TTS 변환
      console.log("🎤 OpenAI TTS 변환 시작...");
      const { convertTextToSpeechOpenAI } = await import("../utils/api");
      const blob = await convertTextToSpeechOpenAI(
        geminiResponse.gptResponse,
        "onyx"
      );
      console.log("✅ OpenAI TTS 생성 완료");

      // 결과 페이지로 이동
      navigate("/result", {
        state: {
          inputText: inputText,
          response: geminiResponse.gptResponse,
          audioBlob: blob,
        },
      });
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
          <div className="absolute inset-0 flex items-center justify-center rounded">
            <div className="flex items-center gap-2 text-white font-[DungGeunMo] text-sm">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              착즙 중...
            </div>
          </div>
        )}
      </button>
    </Layout>
  );
};

export default InputPage;
