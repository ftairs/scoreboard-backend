import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Replace "*" with your frontend URL in production
    "Access-Control-Allow-Methods": "OPTIONS, PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS preflight check successful" }),
    };
  }

  if (event.httpMethod === "PUT") {
    const { previouscount } = JSON.parse(event.body);
    const parsedCount = parseInt(previouscount);

    if (isNaN(parsedCount)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Invalid input data" }),
      };
    }

    try {
      await prisma.scoreboard.update({
        where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
        data: { resetcount: parsedCount + 1 },
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Resetcount updated successfully" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Internal Server Error",
          error: error.message,
        }),
      };
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma connection is closed after each request
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}
