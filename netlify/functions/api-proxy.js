export async function handler(event, context) {
  // CORS 헤더 설정
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // OPTIONS 요청 (preflight) 처리
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    console.log("🔍 API 프록시 요청:", {
      path: event.path,
      httpMethod: event.httpMethod,
      queryStringParameters: event.queryStringParameters,
    });

    // 경로에서 API 경로 추출
    let apiPath = event.path;

    // /.netlify/functions/api-proxy 부분 제거
    if (apiPath.startsWith("/.netlify/functions/api-proxy")) {
      apiPath = apiPath.replace("/.netlify/functions/api-proxy", "");
    }

    // /api로 시작하지 않으면 추가
    if (!apiPath.startsWith("/api")) {
      apiPath = "/api" + apiPath;
    }

    // 백엔드 서버로 요청 전달
    const backendUrl = "https://paykids.shop" + apiPath;

    console.log("🌐 백엔드 요청 URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: event.body,
    });

    const data = await response.text();

    console.log("✅ 백엔드 응답:", {
      status: response.status,
      dataLength: data.length,
    });

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    console.error("❌ API 프록시 오류:", error);

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
