// netlify/functions/scoreboard.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function handler(event, context) {
  try {
    const scoreboard = await prisma.scoreboard.findUnique({
      where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
      select: {
        id: true,
        team1_name: true,
        team1_score: true,
        team2_name: true,
        team2_score: true,
        timer: true,
        period: true,
        resetcount: true,
        team1_color: true,
        team2_color: true,
        team1_fouls: true,
        team2_fouls: true,
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(scoreboard),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch scoreboard" }),
    };
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma connection is closed after each request
  }
}
