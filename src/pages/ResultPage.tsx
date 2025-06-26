import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { playAudio } from "../utils/api";

interface ResultPageState {
  inputText: string;
  response: string;
  audioBlob: Blob;
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);

  // URL 상태에서 데이터 가져오기
  const resultData = location.state as ResultPageState;

  useEffect(() => {
    // 데이터가 없으면 홈으로 리다이렉트
    if (!resultData || !resultData.response) {
      navigate("/");
    }
  }, [resultData, navigate]);

  const handlePlayAudio = async () => {
    if (!resultData?.audioBlob || isPlaying) return;

    try {
      setIsPlaying(true);
      await playAudio(resultData.audioBlob);
    } catch (error) {
      console.error("❌ 음성 재생 실패:", error);
      alert("음성 재생에 실패했습니다.");
    } finally {
      setIsPlaying(false);
    }
  };

  const handleRetry = () => {
    navigate("/input");
  };

  if (!resultData) {
    return null; // 리다이렉트 중
  }

  return (
    <Layout
      className="flex flex-col items-center justify-start min-h-screen p-4"
      showFooter={false}
      onBackClick={() => navigate("/input")}
    >
      {/* 결과 컨테이너 */}
      <div className="max-w-md w-full space-y-6">
        {/* 제목 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🎭 AI 칭찬 결과
          </h1>
          <p className="text-sm text-gray-600">
            당신의 칭찬거리를 분석했습니다!
          </p>
        </div>

        {/* 입력한 내용 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            📝 입력하신 내용
          </h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed text-sm">
              {resultData.inputText}
            </p>
          </div>
        </div>

        {/* AI 분석 결과 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            🤖 AI 칭찬 메시지
          </h2>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-gray-700 leading-relaxed text-center text-sm whitespace-pre-wrap">
              {resultData.response}
            </p>
          </div>

          {/* 음성 재생 버튼 */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md transform hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  재생 중...
                </>
              ) : (
                <>
                  <span className="text-lg">🎵</span>
                  음성으로 듣기
                </>
              )}
            </button>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md transform hover:scale-105"
          >
            🔄 다시 시도
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-md transform hover:scale-105"
          >
            🏠 홈으로
          </button>
        </div>
        <div className="flex flex-col mx-auto w-5/5">
          <img src={DummyImg} className="w-2/5 mx-auto mt-5 z-10" />
          <img src={Background} className="w-9/10 mx-auto -mt-6" />
          <img src={DownLoad} className="bg-black w-5" />
          <img src={WhitePlay} className="bg-black w-5" />
        </div>
        <div className="flex flex-row mx-auto w-9/10 mt-10">
          <div className="mx-auto"><img src={ResultBtn} className=" h-20" /><p className="font-[DungGeunMo] text-red-500 text-4xl mr-3 -mt-15 ml-6">결과 공유하기</p></div>
          <img src={RecBtn} className="mx-auto h-20" />
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
