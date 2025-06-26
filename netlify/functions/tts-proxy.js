export async function handler(event, context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // OPTIONS 요청 (preflight) 처리
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { text, voice = "nova" } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Text is required" }),
      };
    }

    // Netlify 환경 변수에서 OpenAI API 키 가져오기
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.error("OpenAI API key not found in environment variables");
      // 목업 오디오 데이터 반환
      const mockAudioData = Buffer.alloc(1024);
      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Content-Type": "audio/mpeg",
        },
        body: mockAudioData.toString("base64"),
        isBase64Encoded: true,
      };
    }

    console.log("🎵 OpenAI TTS API 호출:", {
      text: text.substring(0, 50),
      voice,
    });

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
        `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const audioBuffer = await response.arrayBuffer();
    console.log("✅ TTS 생성 완료:", audioBuffer.byteLength, "바이트");

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
      },
      body: Buffer.from(audioBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("❌ TTS 프록시 오류:", error);

    // 에러 시 목업 오디오 데이터 반환
    const mockAudioData = Buffer.alloc(1024);
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
      },
      body: mockAudioData.toString("base64"),
      isBase64Encoded: true,
    };
  }
}
