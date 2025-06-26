import React, { useEffect, useState, useRef } from "react";
import { Layout } from "../components/Layout";
import { Modal } from "../components/Modal";
import LoadingBar from "../components/LoadingBar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  regenerateGeminiResponse,
  convertTextToSpeechOpenAI,
  getResultByUuid,
} from "../utils/api";
import ResultBackground from "../assets/images/ResultBackground.png";
import SubmitButton from "../assets/images/Share.png";
import RefreshBtn from "../assets/images/RefreshButton.png";
import LoadingImg from "../assets/images/Loading.png";
import { IoPause, IoPlay } from "react-icons/io5";
import { FiRefreshCw } from "react-icons/fi";

interface ResultPageState {
  uuid: string;
  inputText: string;
  response: string;
  audioBlob: Blob;
  imageUrl?: string;
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<ResultPageState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // URL 상태에서 데이터 가져오기 또는 URL 파라미터에서 UUID 읽기
  useEffect(() => {
    const stateData = location.state as ResultPageState;
    const urlParams = new URLSearchParams(location.search);
    const uuidFromUrl = urlParams.get("uuid");

    if (stateData && stateData.response) {
      // 상태에서 데이터가 있으면 사용
      setResultData(stateData);
      setIsRegenerating(false);
    } else if (uuidFromUrl) {
      // URL 파라미터에서 UUID가 있으면 서버에서 데이터 로드
      loadResultFromUuid(uuidFromUrl);
    } else {
      // 둘 다 없으면 홈으로 리다이렉트
      navigate("/");
    }
  }, [location, navigate]);

  const loadResultFromUuid = async (uuid: string) => {
    try {
      setIsLoading(true);

      if (import.meta.env.DEV) {
        console.log("🔍 UUID로 결과 데이터 로드 중:", uuid);
      }

      // 서버에서 UUID로 데이터 가져오기
      const data = await getResultByUuid(uuid);

      if (import.meta.env.DEV) {
        console.log("✅ UUID 데이터 로드 완료:", data);
      }

      // TTS 재생성 (서버에서 오디오는 저장하지 않으므로)
      const audioBlob = await convertTextToSpeechOpenAI(
        data.gptResponse,
        "nova"
      );

      // 결과 데이터 설정
      setResultData({
        uuid: data.uuid,
        inputText: data.prompt,
        response: data.gptResponse,
        audioBlob: audioBlob,
        imageUrl: data.imageUrl || "",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ UUID 데이터 로드 실패:", error);
      }
      alert("공유된 결과를 불러올 수 없습니다. 링크를 다시 확인해주세요.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    if (!resultData?.audioBlob) return;

    try {
      if (!audioRef.current) {
        // 오디오 객체 생성
        const audioUrl = URL.createObjectURL(resultData.audioBlob);
        audioRef.current = new Audio(audioUrl);

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        audioRef.current.onerror = () => {
          alert("음성 재생에 실패했습니다.");
          setIsPlaying(false);
          setIsPaused(false);
        };
      }

      if (isPlaying && !isPaused) {
        // 일시정지
        audioRef.current.pause();
        setIsPaused(true);
      } else if (isPlaying && isPaused) {
        // 재생 재개
        audioRef.current.play();
        setIsPaused(false);
      } else {
        // 처음 재생
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ 음성 재생 실패:", error);
      }
      alert("음성 재생에 실패했습니다.");
    }
  };

  const handleRetry = () => {
    setIsModalOpen(true);
  };

  const handleConfirmRetry = async () => {
    if (!resultData?.uuid) {
      alert("재생성에 필요한 정보가 없습니다.");
      return;
    }

    try {
      setIsRegenerating(true);

      // 재생 중인 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }

      if (import.meta.env.DEV) {
        console.log("🔄 재생성 시작...");
      }

      // 재생성 API 호출
      const regeneratedData = await regenerateGeminiResponse(resultData.uuid);

      // 새로운 응답으로 TTS 생성
      if (import.meta.env.DEV) {
        console.log("🎤 새로운 응답으로 TTS 생성 중...");
      }
      const newAudioBlob = await convertTextToSpeechOpenAI(
        regeneratedData.gptResponse,
        "nova"
      );

      if (import.meta.env.DEV) {
        console.log("✅ 재생성 완료!");
      }

      // 로딩 상태 해제
      setIsRegenerating(false);

      // 현재 페이지를 새로운 데이터로 업데이트
      navigate("/result", {
        state: {
          uuid: regeneratedData.uuid,
          inputText: regeneratedData.prompt,
          response: regeneratedData.gptResponse,
          audioBlob: newAudioBlob,
          imageUrl: regeneratedData.imageUrl,
        },
        replace: true, // 현재 페이지를 대체
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ 재생성 실패:", error);
      }
      alert("재생성에 실패했습니다. 다시 시도해주세요.");
      setIsRegenerating(false);
    }
  };

  const handleShare = async () => {
    if (!resultData?.uuid) {
      alert("공유할 수 없습니다. 데이터가 없습니다.");
      return;
    }

    try {
      // UUID를 이용한 공유 링크 생성
      const shareUrl = `${window.location.origin}/result?uuid=${resultData.uuid}`;

      if (import.meta.env.DEV) {
        console.log("📤 UUID 기반 공유 링크 생성:", shareUrl);
      }

      // 네이티브 공유 API 사용 (모바일)
      if (navigator.share) {
        await navigator.share({
          title: "AI 칭찬 결과",
          text: "AI가 생성한 따뜻한 칭찬 메시지를 확인해보세요!",
          url: shareUrl,
        });
      } else {
        // 클립보드 복사 (데스크톱)
        await navigator.clipboard.writeText(shareUrl);
        alert(`공유 링크가 클립보드에 복사되었습니다!\n\n${shareUrl}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ 공유 링크 생성 실패:", error);
      }

      // 실패 시 텍스트 복사로 fallback
      try {
        await navigator.clipboard.writeText(resultData.response);
        alert("결과 텍스트가 클립보드에 복사되었습니다!");
      } catch {
        alert("공유에 실패했습니다. 나중에 다시 시도해주세요.");
      }
    }
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      // 컴포넌트 언마운트 시 로딩 상태도 정리
      setIsRegenerating(false);
    };
  }, []);

  // 로딩 중이거나 데이터가 없으면 로딩 화면
  if (isLoading || !resultData) {
    return (
      <Layout
        className="flex flex-col items-center justify-start"
        onBackClick={() => navigate("/input")}
      >
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center mb-4">
            <img src={LoadingImg} alt="Loading" className="w-4/5 max-w-md" />
            <div className="absolute top-3 flex items-center justify-center">
              <div className="flex flex-row items-center">
                <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3">
                  칭찬
                </span>
                <span className="font-[DungGeunMo] text-white text-4xl">
                  불러오는 중...
                </span>
              </div>
            </div>
          </div>
          <div className="w-4/5 max-w-md">
            <LoadingBar />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      className="flex flex-col items-center justify-start"
      onBackClick={() => navigate("/input")}
    >
      {/* 재생성 로딩 오버레이 */}
      {isRegenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          {/* 로딩 이미지와 텍스트 */}
          <div className="relative flex items-center justify-center mb-4">
            <img src={LoadingImg} alt="Loading" className="w-4/5 max-w-md" />
            <div className="absolute top-3 flex items-center justify-center">
              <div className="flex flex-row items-center">
                <span className="font-[DungGeunMo] text-red-500 text-4xl mr-3">
                  칭찬
                </span>
                <span className="font-[DungGeunMo] text-white text-4xl">
                  재생성 중...
                </span>
              </div>
            </div>
          </div>

          {/* 로딩바 */}
          <div className="w-4/5 max-w-md">
            <LoadingBar />
          </div>
        </div>
      )}

      {/* 제목 */}
      <div className="text-center text-white text-4xl font-[DungGeunMo] mt-4 mb-6 pb-25">
        <span className="text-red-500 mr-3">칭찬</span>낋여왔다네
      </div>

      {/* 배경 이미지와 결과 컨테이너 */}
      <div className="relative w-full px-5">
        {/* 서버에서 받은 이미지 (있을 경우) */}
        {resultData.imageUrl && resultData.imageUrl.trim() !== "" && (
          <div className="flex absolute -top-25 left-1/2 -translate-x-1/2 justify-center">
            <img
              src={resultData.imageUrl}
              alt="backImage"
              onLoad={() => {
                if (import.meta.env.DEV) {
                  console.log("✅ 이미지 로딩 성공:", resultData.imageUrl);
                }
              }}
              onError={(e) => {
                if (import.meta.env.DEV) {
                  console.error("❌ 이미지 로딩 실패:", resultData.imageUrl);
                  console.error("❌ 에러 상세:", e);
                }
                // 이미지 로드 실패 시 숨김
                e.currentTarget.style.display = "none";
              }}
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}

        <div className="flex gap-4 mt-2 absolute -top-10 right-12 border-2 border-white">
          {/* 음성 재생/일시정지 버튼 */}
          <button
            onClick={handlePlayPause}
            className="text-white transition-all hover:scale-110 active:scale-95"
          >
            {isPlaying && !isPaused ? (
              <IoPause size={25} />
            ) : (
              <IoPlay size={25} />
            )}
          </button>
        </div>

        {/* 디버깅: imageUrl 상태 표시 */}
        {(!resultData.imageUrl || resultData.imageUrl.trim() === "") && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black p-2 rounded text-xs z-10">
            이미지 URL 없음: {resultData.imageUrl || "undefined"}
          </div>
        )}

        <img
          src={ResultBackground}
          alt="Result Background"
          className="w-full h-auto"
        />

        {/* 결과 텍스트 */}
        <div className="absolute top-7 px-10 left-0">
          <div className="flex flex-col items-center">
            <div className="rounded-xl p-5 shadow-lg">
              <p className="text-white font-[DungGeunMo] leading-relaxed text-center">
                {resultData.response}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼들 */}
      <div className="flex gap-4 mt-6 px-4">
        {/* 공유하기 버튼 */}
        <button
          onClick={handleShare}
          className="relative transition-all hover:scale-105 active:scale-95"
        >
          <img src={SubmitButton} alt="공유하기" className="w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red-500 font-[DungGeunMo] text-2xl">
              결과 공유하기
            </span>
          </div>
        </button>

        {/* 재생성 버튼 */}
        <button
          onClick={handleRetry}
          className="relative transition-all hover:scale-110 active:scale-95"
          disabled={isRegenerating}
        >
          <img src={RefreshBtn} alt="재생성" className="size-full" />
          {/* 새로고침 아이콘 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <FiRefreshCw size={24} className="text-red-500 text-2xl" />
          </div>
        </button>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={setIsModalOpen}
          open={isModalOpen}
          onYes={handleConfirmRetry}
          onNo={() => {
            setIsModalOpen(false);
            setIsRegenerating(false); // Modal을 닫을 때도 로딩 상태 해제
          }}
        />
      )}
    </Layout>
  );
};

export default ResultPage;
