// Gemini API 응답 타입 정의
export interface GeminiResponse {
  uuid: string;
  prompt: string;
  gptResponse: string;
  imageUrl: string;
  createdAt: string;
}

// API 베이스 URL 설정
const API_BASE_URL = import.meta.env.PROD
  ? "https://paykids.shop" // 프로덕션 환경
  : ""; // 개발 환경 (프록시 사용)

// Gemini API 호출 함수 (실제 API 사용)
export async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
  try {
    const requestData = {
      prompt: prompt,
    };

    const apiUrl = `${API_BASE_URL}/api/gemini`;

    if (import.meta.env.DEV) {
      console.log("🤖 실제 Gemini API 호출 중...");
      console.log("📤 요청 URL:", apiUrl);
      console.log("📤 요청 데이터:", requestData);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (import.meta.env.DEV) {
      console.log("📥 응답 상태:", response.status, response.statusText);
    }

    if (!response.ok) {
      // 에러 응답의 내용을 읽어서 더 자세한 정보 제공
      let errorDetails = "";
      try {
        const errorText = await response.text();
        errorDetails = errorText ? ` - ${errorText}` : "";
        if (import.meta.env.DEV) {
          console.log("❌ 에러 응답 내용:", errorText);
        }
      } catch {
        // 에러 텍스트를 읽을 수 없는 경우 무시
      }

      throw new Error(
        `Gemini API 요청 실패: ${response.status} ${response.statusText}${errorDetails}`
      );
    }

    const data: GeminiResponse = await response.json();
    if (import.meta.env.DEV) {
      console.log("✅ Gemini API 응답 받음:", data);
    }

    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ Gemini API 호출 실패:", error);
    }

    // 에러 발생 시 목업 응답 제공
    return {
      uuid: crypto.randomUUID(),
      prompt: prompt,
      gptResponse:
        "죄송합니다. 현재 서버에 문제가 있어 칭찬 메시지를 생성할 수 없습니다. 잠시 후 다시 시도해주세요.",
      imageUrl: "",
      createdAt: new Date().toISOString(),
    };
  }
}

export interface TTSOptions {
  voice: string;
  language: string;
  speed: number;
  emotion?: {
    happiness?: number;
    surprise?: number;
    other?: number;
  };
  pitch_std?: number;
  speaking_rate?: number;
}

// OpenAI TTS API를 사용한 음성 변환 함수
export const convertTextToSpeechOpenAI = async (
  text: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "onyx"
): Promise<Blob> => {
  if (import.meta.env.DEV) {
    console.log("🤖 OpenAI TTS 요청 중...");
    console.log("📝 텍스트:", text);
  }

  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!openaiApiKey || openaiApiKey === "your_openai_api_key_here") {
    if (import.meta.env.DEV) {
      console.log("⚠️ OpenAI API 키가 설정되지 않음, 목업 데이터 사용");
    }
    // 목업 오디오 데이터 반환
    const mockAudioData = new ArrayBuffer(1024);
    return new Blob([mockAudioData], { type: "audio/mpeg" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voice,
        response_format: "mp3",
        speed: 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const audioBlob = await response.blob();
    if (import.meta.env.DEV) {
      console.log("✅ OpenAI TTS 생성 완료:", audioBlob.size, "바이트");
    }
    return audioBlob;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ OpenAI TTS 실패:", error);
    }

    // 에러 시 목업 데이터 반환
    const mockAudioData = new ArrayBuffer(1024);
    return new Blob([mockAudioData], { type: "audio/mpeg" });
  }
};

// 사용 가능한 음성 목록 가져오기
export const getAvailableVoices = async (): Promise<{
  voices: string[];
  presets: string[];
}> => {
  try {
    const response = await fetch("http://localhost:8000/voices");
    if (!response.ok) {
      throw new Error(`음성 목록 가져오기 실패: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("음성 목록 가져오기 오류:", error);
    return {
      voices: ["default", "유병재", "차분한", "활발한"],
      presets: ["default", "유병재", "차분한", "활발한"],
    };
  }
};

// 오디오 재생 함수
export function playAudio(audioBlob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error("오디오 재생 실패"));
    };

    audio.play().catch(reject);
  });
}

// 오디오 다운로드 함수
export function downloadAudio(
  audioBlob: Blob,
  filename: string = "speech.mp3"
): void {
  const url = URL.createObjectURL(audioBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 기존 함수와의 호환성을 위한 래퍼 함수
export const convertTextToSpeech = async (
  text: string,
  _options?: TTSOptions // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<Blob> => {
  // OpenAI TTS로 리다이렉트 (nova 목소리 사용)
  // options는 현재 OpenAI TTS에서 사용하지 않지만 호환성을 위해 유지
  if (import.meta.env.DEV) {
    console.log("🔄 기존 TTS 함수 호출됨, OpenAI로 리다이렉트");
  }
  return convertTextToSpeechOpenAI(text, "nova");
};

// UUID로 결과 데이터 가져오기 함수
export async function getResultByUuid(uuid: string): Promise<GeminiResponse> {
  try {
    if (import.meta.env.DEV) {
      console.log("🔍 UUID로 결과 데이터 가져오기 중...", uuid);
    }

    const apiUrl = `${API_BASE_URL}/api/gemini/${uuid}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `결과 데이터 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data: GeminiResponse = await response.json();
    if (import.meta.env.DEV) {
      console.log("✅ UUID 결과 데이터 받음:", data);
    }

    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ UUID 결과 데이터 가져오기 실패:", error);
    }
    throw error;
  }
}

// 재생성 API 호출 함수
export async function regenerateGeminiResponse(
  uuid: string
): Promise<GeminiResponse> {
  try {
    if (import.meta.env.DEV) {
      console.log("🔄 재생성 API 호출 중...", uuid);
    }

    const apiUrl = `${API_BASE_URL}/api/gemini/${uuid}/regenerate`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `재생성 API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data: GeminiResponse = await response.json();
    if (import.meta.env.DEV) {
      console.log("✅ 재생성 API 응답 받음:", data);
    }

    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("❌ 재생성 API 호출 실패:", error);
    }
    throw error;
  }
}
