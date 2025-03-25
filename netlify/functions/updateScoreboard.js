// netlify/functions/updateScoreboard.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(event, context) {
  if (event.httpMethod === "PUT") {
    const {
      team1_score,
      team2_score,
      team1_color,
      team2_color,
      timer,
      team1_name,
      team2_name,
      period,
      resetcount,
      team1_fouls,
      team2_fouls,
    } = JSON.parse(event.body);

    try {
      const updatedScoreboard = await prisma.scoreboard.update({
        where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
        data: {
          team1_score,
          team2_score,
          team1_color,
          team2_color,
          timer,
          team1_name,
          team2_name,
          period,
          resetcount,
          team1_fouls,
          team2_fouls,
        },
      });
      return {
        statusCode: 200,
        body: JSON.stringify(updatedScoreboard),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to update scoreboard" }),
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
