// Gemini API 응답 타입 정의
export interface GeminiResponse {
  uuid: string;
  prompt: string;
  gptResponse: string;
  imageUrl: string;
  createdAt: string;
}

// Gemini API 호출 함수 (목업 데이터 사용)
export async function callGeminiAPI(prompt: string): Promise<GeminiResponse> {
  try {
    // 실제 API 호출 대신 목업 응답 생성
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 실제 API 호출처럼 딜레이 추가

    // 짧고 간결한 목업 응답으로 변경 (TTS 처리 시간 단축)
    const mockResponses = [
      "오늘도 수고했어요! 😊 내일은 더 좋은 날이 될 거예요. 행복한 하루 되라~",

      "힘든 하루였지만 잘 버텨냈네요! 💪 충분히 쉬세요. 행복한 하루 되라~",

      "정말 멋진 하루였어요! 🌟 자신을 칭찬해주세요. 행복한 하루 되라~",
    ];

    // 랜덤하게 목업 응답 선택
    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    return {
      uuid: crypto.randomUUID(),
      prompt: prompt,
      gptResponse: randomResponse,
      imageUrl: "", // 현재는 이미지 없음
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("목업 API 처리 중 오류:", error);

    // 에러 발생 시에도 짧은 기본 응답 제공
    return {
      uuid: crypto.randomUUID(),
      prompt: prompt,
      gptResponse: "오늘도 고생했어요! 😊 잘 쉬세요.",
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

// 유병재 목소리 TTS (로컬 서버 우선, Replicate API 폴백)
export const convertTextToSpeech = async (
  text: string,
  options: TTSOptions = {
    voice: "유병재",
    language: "ko",
    speed: 1.0,
  }
): Promise<Blob> => {
  console.log("🎭 유병재 목소리 TTS 요청 중...");
  console.log("📝 텍스트:", text);

  // 1단계: 로컬 Zonos 서버 시도
  try {
    console.log("🔄 로컬 Zonos 서버 시도 중...");
    const localResponse = await fetch("http://localhost:8000/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Zyphra/Zonos-v0.1-transformer",
        input: text,
        voice: "유병재",
        speed: options.speed || 1.0,
        language: "ko",
        emotion: options.emotion || {
          happiness: 0.5,
          surprise: 0.1,
          other: 0.4,
        },
        pitch_std: 20.0,
        speaking_rate: 18.0,
        response_format: "mp3",
      }),
    });

    if (localResponse.ok) {
      const audioBlob = await localResponse.blob();
      console.log("✅ 로컬 서버로 TTS 생성 완료:", audioBlob.size, "바이트");
      return audioBlob;
    } else {
      throw new Error(`로컬 서버 응답 오류: ${localResponse.status}`);
    }
  } catch (localError) {
    console.log("❌ 로컬 서버 실패:", localError);
  }

  // 2단계: Replicate API 시도
  try {
    console.log("🔄 Replicate API로 폴백 시도...");

    const replicateToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
    if (!replicateToken || replicateToken === "your_replicate_api_token_here") {
      console.log("⚠️ Replicate API 토큰이 설정되지 않음");
      throw new Error("Replicate API 토큰 필요");
    }

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "jaaari/zonos:latest",
        input: {
          text: text,
          language: "ko",
          emotion_happiness: options.emotion?.happiness || 0.7,
          emotion_surprise: options.emotion?.surprise || 0.2,
          speed: options.speed || 1.0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API 요청 실패: ${response.status}`);
    }

    const prediction = await response.json();
    console.log("🔄 Replicate 예측 시작:", prediction.id);

    // 예측 완료될 때까지 폴링
    let result = prediction;
    let pollCount = 0;
    const maxPolls = 30; // 최대 30초 대기

    while (
      (result.status === "starting" || result.status === "processing") &&
      pollCount < maxPolls
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: {
            Authorization: `Token ${replicateToken}`,
          },
        }
      );
      result = await statusResponse.json();
      console.log(
        `⏳ 예측 상태 (${pollCount + 1}/${maxPolls}):`,
        result.status
      );
      pollCount++;
    }

    if (result.status === "succeeded" && result.output) {
      const audioResponse = await fetch(result.output);
      const audioBlob = await audioResponse.blob();
      console.log(
        "✅ Replicate API로 TTS 생성 완료:",
        audioBlob.size,
        "바이트"
      );
      return audioBlob;
    } else {
      throw new Error(`예측 실패: ${result.error || result.status}`);
    }
  } catch (replicateError) {
    console.error("❌ Replicate API도 실패:", replicateError);
  }

  // 3단계: 최종 폴백 - 목업 데이터
  console.log("🔄 목업 오디오 데이터로 최종 폴백...");
  console.log("💡 안내: 실제 TTS 서비스를 사용하려면:");
  console.log("1. 로컬 Zonos 서버를 실행하거나");
  console.log("2. .env.local 파일에 VITE_REPLICATE_API_TOKEN 설정");

  const mockAudioData = new ArrayBuffer(1024);
  return new Blob([mockAudioData], { type: "audio/mpeg" });
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
