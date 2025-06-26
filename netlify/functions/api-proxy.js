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
    // 백엔드 서버로 요청 전달
    const backendUrl =
      "https://paykids.shop" +
      event.path.replace("/.netlify/functions/api-proxy", "");

    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
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
