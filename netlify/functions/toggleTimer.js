// netlify/functions/toggletimer.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(event, context) {
  if (event.httpMethod === "PUT") {
    try {
      const scoreboard = await prisma.scoreboard.findUnique({
        where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
      });

      if (!scoreboard) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Scoreboard not found" }),
        };
      }

      const updatedScoreboard = await prisma.scoreboard.update({
        where: { id: scoreboard.id },
        data: { timerRunning: !scoreboard.timerRunning },
      });

      return {
        statusCode: 200,
        body: JSON.stringify(updatedScoreboard),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to toggle timer" }),
      };
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma connection is closed after each request
    }
  }
  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
}
