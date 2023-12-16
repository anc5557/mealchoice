// index.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyAuthToken } from "./verifyAuthToken";
import { foodRecommendationHandler } from "./foodRecommendationHandler";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "POST") {
    const authResult = await verifyAuthToken(event);

    if ("statusCode" in authResult && authResult.statusCode !== 200) {
      return {
        statusCode: authResult.statusCode,
        body: authResult.body,
      };
    }

    return await foodRecommendationHandler(event, authResult.uid);
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: "지원하지 않는 메소드입니다." }),
  };
};
