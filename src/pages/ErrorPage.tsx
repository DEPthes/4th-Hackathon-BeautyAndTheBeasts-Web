import React from "react";
import { Layout } from "../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorLogo from "../assets/images/ErrorLogo.svg";
import Warning from "../assets/images/WarningBtn.svg";
import ErrorBox from "../assets/images/ErrorBox.svg";
import RefreshBtn from "../assets/images/RefreshButton.png";
import Play from "../assets/images/Play.svg";

interface ErrorPageState {
  errorType?: "api" | "network" | "tts" | "unknown";
  errorMessage?: string;
  inputText?: string;
}

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL 상태에서 에러 정보 가져오기
  const errorData = location.state as ErrorPageState;

  const getErrorMessage = () => {
    switch (errorData?.errorType) {
      case "api":
        return "AI 서버와 연결할 수 없어.\n잠시 후 다시 시도해달라.";
      case "network":
        return "인터넷 연결을 확인해달라.\n네트워크가 불안정하다.";
      case "tts":
        return "음성 변환에 실패했어.\n다시 시도해달라.";
      default:
        return "지금은 곤란하다,\n다시 시도해달라.";
    }
  };

  const handleRefresh = () => {
    // 이전 입력 텍스트가 있으면 다시 시도, 없으면 입력 페이지로
    if (errorData?.inputText) {
      navigate("/input", {
        state: {
          previousText: errorData.inputText,
          retry: true,
        },
      });
    } else {
      navigate("/input");
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="flex flex-col justify-center items-center h-full min-h-screen">
        <img src={ErrorLogo} className="w-4/5 max-w-md" />

        <div className="relative w-4/5 max-w-md mt-20">
          <img src={ErrorBox} className="w-full" />

          {/* 에러 메시지 오버레이 */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="flex flex-row mt-8 mb-8 items-center">
              <img src={Warning} className="w-16 mr-4 flex-shrink-0" />
              <p className="text-white text-xl font-[DungGeunMo] leading-relaxed">
                {getErrorMessage()}
              </p>
            </div>

            {/* 에러 세부 정보 */}
            {errorData?.errorMessage && (
              <div className="bg-red-900/30 rounded-lg p-3 mb-4 max-w-xs">
                <p className="text-red-200 text-xs font-mono">
                  {errorData.errorMessage}
                </p>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              {/* 다시 시도 버튼 */}
              <button
                onClick={handleRefresh}
                className="bg-contain bg-center text-red-500 font-[DungGeunMo] text-3xl flex items-center justify-center relative"
              >
                <img src={RefreshBtn} className="w-48 relative" />
                <div className="flex flex-row absolute cursor-pointer items-center">
                  <img src={Play} className="mr-3 w-6" />
                  <p>다시 시도</p>
                </div>
              </button>

              {/* 홈으로 가기 버튼 */}
              <button
                onClick={handleGoHome}
                className="px-6 py-2 bg-gray-600 text-white rounded-full font-[DungGeunMo] text-sm hover:bg-gray-700 transition-colors"
              >
                🏠 홈으로 가기
              </button>
            </div>
          </div>
        </div>

        {/* 도움말 섹션 */}
        <div className="mt-8 max-w-md w-4/5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-white/80 text-sm font-[DungGeunMo] mb-2">
              💡 문제가 계속 발생한다면?
            </p>
            <div className="text-white/60 text-xs space-y-1">
              <p>• 인터넷 연결 상태를 확인해보세요</p>
              <p>• 브라우저를 새로고침해보세요</p>
              <p>• 잠시 후 다시 시도해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
