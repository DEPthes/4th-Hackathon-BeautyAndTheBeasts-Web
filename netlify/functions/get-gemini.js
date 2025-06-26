export async function handler(event, context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // OPTIONS 요청 (preflight) 처리
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // URL에서 UUID 추출
    const pathParts = event.path.split("/");
    const uuid = pathParts[pathParts.length - 1];

    console.log("🔍 UUID 조회 요청:", {
      path: event.path,
      uuid: uuid,
      pathParts: pathParts,
    });

    if (!uuid || uuid.length < 30) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Valid UUID is required" }),
      };
    }

    // 백엔드에서 UUID로 데이터 조회
    const backendUrl = `https://paykids.shop/api/gemini/${uuid}`;

    console.log("🌐 백엔드 조회 URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "❌ 백엔드 응답 오류:",
        response.status,
        response.statusText
      );
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: "Failed to fetch data from backend",
          status: response.status,
        }),
      };
    }

    const data = await response.text();

    console.log("✅ UUID 조회 성공:", {
      uuid: uuid,
      dataLength: data.length,
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    console.error("❌ UUID 조회 오류:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
}
