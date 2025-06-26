import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { callGeminiAPI } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";
import InputImage from "../assets/images/InputImage.png";
import SubmitButton from "../assets/images/SubmitButton.png";

interface InputPageState {
  previousText?: string;
  retry?: boolean;
}

const InputPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이전 텍스트 복원 (에러 후 다시 시도할 때)
  useEffect(() => {
    const stateData = location.state as InputPageState;
    if (stateData?.previousText) {
      setInputText(stateData.previousText);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      alert("칭찬거리를 입력해주세요!");
      return;
    }

    if (import.meta.env.DEV) {
      console.log("📝 제출된 텍스트:", inputText);
    }
    setIsLoading(true);

    // 로딩 페이지로 이동
    navigate("/loading");

    try {
      // Gemini API 호출
      if (import.meta.env.DEV) {
        console.log("🤖 Gemini API 호출 중...");
      }
      const geminiResponse = await callGeminiAPI(inputText);
      if (import.meta.env.DEV) {
        console.log("✅ Gemini 응답 받음:", geminiResponse.gptResponse);
      }

      // TTS 변환
      if (import.meta.env.DEV) {
        console.log("🎤 TTS 변환 시작...");
      }
      const { convertTextToSpeech } = await import("../utils/api");
      const blob = await convertTextToSpeech(geminiResponse.gptResponse);
      if (import.meta.env.DEV) {
        console.log("✅ TTS 생성 완료");
      }

      // 결과 페이지로 이동
      navigate("/result", {
        state: {
          uuid: geminiResponse.uuid,
          inputText: inputText,
          response: geminiResponse.gptResponse,
          audioBlob: blob,
          imageUrl: geminiResponse.imageUrl,
        },
        replace: true, // 로딩 페이지를 히스토리에서 제거
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ 처리 중 오류:", error);
      }

      // 에러 타입 분석
      let errorType: "api" | "network" | "tts" | "unknown" = "unknown";
      let errorMessage = "";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (
          errorMessage.includes("Gemini API") ||
          errorMessage.includes("fetch")
        ) {
          errorType = "api";
        } else if (
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("Failed to fetch")
        ) {
          errorType = "network";
        } else if (
          errorMessage.includes("OpenAI") ||
          errorMessage.includes("TTS")
        ) {
          errorType = "tts";
        }
      }

      // 에러 페이지로 이동
      navigate("/error", {
        state: {
          errorType,
          errorMessage,
          inputText: inputText,
        },
        replace: true, // 로딩 페이지를 히스토리에서 제거
      });
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
            <div className="flex items-center gap-2 text-white font-[DungGeunMo] text-sm">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              착즙 시작...
            </div>
          </div>
        )}
      </button>

      {/* 다시 시도 안내 (retry 상태일 때) */}
      {location.state && (location.state as InputPageState).retry && (
        <div className="mt-4 max-w-md w-full px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-800 text-sm font-medium">
              🔄 이전 내용이 복원되었습니다. 다시 시도해보세요!
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InputPage;
