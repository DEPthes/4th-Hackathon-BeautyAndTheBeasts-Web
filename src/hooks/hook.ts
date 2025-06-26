import { useMutation } from "@tanstack/react-query";
import {
  callGeminiAPI,
  convertTextToSpeech,
  playAudio,
  downloadAudio,
  type GeminiResponse,
  type TTSOptions,
} from "../utils/api";

// Gemini API 호출을 위한 훅
export const useGeminiAPI = () => {
  return useMutation<GeminiResponse, Error, string>({
    mutationFn: callGeminiAPI,
    onSuccess: (data) => {
      console.log("✅ Gemini API 호출 성공:", data);
    },
    onError: (error) => {
      console.error("❌ Gemini API 호출 실패:", error);
    },
  });
};

// TTS 변환을 위한 훅
export const useTTSAPI = () => {
  return useMutation<Blob, Error, { text: string; options?: TTSOptions }>({
    mutationFn: ({ text, options }) => convertTextToSpeech(text, options),
    onSuccess: (data) => {
      console.log("✅ TTS 변환 성공:", data.size, "바이트");
    },
    onError: (error) => {
      console.error("❌ TTS 변환 실패:", error);
    },
  });
};

// 오디오 재생을 위한 훅
export const useAudioPlayer = () => {
  return useMutation<void, Error, Blob>({
    mutationFn: playAudio,
    onSuccess: () => {
      console.log("✅ 오디오 재생 성공");
    },
    onError: (error) => {
      console.error("❌ 오디오 재생 실패:", error);
    },
  });
};

export const useAudioDownload = () => {
  return useMutation<void, Error, { blob: Blob; filename?: string }>({
    mutationFn: async ({ blob, filename }) => {
      downloadAudio(blob, filename);
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("✅ 오디오 다운로드 성공");
    },
    onError: (error) => {
      console.error("❌ 오디오 다운로드 실패:", error);
    },
  });
};

// 통합된 Gemini + TTS 훅
export const useGeminiWithTTS = () => {
  const geminiMutation = useGeminiAPI();
  const ttsMutation = useTTSAPI();
  const audioPlayerMutation = useAudioPlayer();

  const processTextAndPlay = async (
    text: string,
    voiceOptions: Partial<TTSOptions> = {}
  ): Promise<void> => {
    console.log("🎵 음성 처리 및 재생 시작:", {
      text: text.substring(0, 30),
      voiceOptions,
    });

    try {
      // TTS로 음성 생성
      const audioBlob = await convertTextToSpeech(text, {
        voice: "default",
        language: "ko",
        speed: 1.0,
        ...voiceOptions,
      });

      // 오디오 URL 생성
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("🔊 오디오 URL 생성됨:", audioUrl);

      // 오디오 재생
      const audio = new Audio(audioUrl);

      // 재생 이벤트 리스너
      audio.addEventListener("loadstart", () => {
        console.log("📥 오디오 로드 시작");
      });

      audio.addEventListener("canplay", () => {
        console.log("▶️ 오디오 재생 준비 완료");
      });

      audio.addEventListener("play", () => {
        console.log("🎶 오디오 재생 시작됨");
      });

      audio.addEventListener("ended", () => {
        console.log("✅ 오디오 재생 완료");
        // 메모리 정리
        URL.revokeObjectURL(audioUrl);
      });

      audio.addEventListener("error", (e) => {
        console.error("❌ 오디오 재생 오류:", e);
        URL.revokeObjectURL(audioUrl);
      });

      // 재생 시작
      await audio.play();
    } catch (error) {
      console.error("❌ 음성 처리 및 재생 중 오류:", error);
      throw new Error(
        `음성 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  };

  const downloadSpeech = (audioBlob: Blob, filename?: string) => {
    useAudioDownload().mutate({ blob: audioBlob, filename });
  };

  return {
    processTextAndPlay,
    downloadSpeech,
    isGeminiLoading: geminiMutation.isPending,
    isTTSLoading: ttsMutation.isPending,
    isAudioPlaying: audioPlayerMutation.isPending,
    isProcessing: geminiMutation.isPending || ttsMutation.isPending,
    geminiError: geminiMutation.error,
    ttsError: ttsMutation.error,
    audioError: audioPlayerMutation.error,
    reset: () => {
      geminiMutation.reset();
      ttsMutation.reset();
      audioPlayerMutation.reset();
    },
  };
};
