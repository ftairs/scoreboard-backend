import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const port = 3030;

// Prisma Singleton
const prisma = new PrismaClient();

// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_CORS_URL }));
app.options("*", cors());
// GET /scoreboard - Retrieve scoreboard data
app.get("/scoreboard", async (req, res) => {
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
    res.json(scoreboard);
    // console.log(scoreboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scoreboard" });
  }
});

// PUT /scoreboard - Update scoreboard data
app.put("/scoreboard", async (req, res) => {
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
  } = await req.body;
  console.log({ req: req.body });
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
    res.json(updatedScoreboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to update scoreboard" });
  }
});

app.put("/timerreset", async (req, res) => {
  try {
    const { previouscount } = req.body;

    // Validate the input
    const parsedCount = parseInt(previouscount);
    if (isNaN(parsedCount)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Update the resetcount in the database using Prisma
    const result = await prisma.scoreboard.update({
      where: { id: process.env.DEV_SETTING === "development" ? 2 : 1 },
      data: { resetcount: parsedCount + 1 },
    });

    if (!result) {
      return res.status(500).json({ message: "Failed to update resetcount" });
    }

    return res.status(200).json({ message: "Resetcount updated successfully" });
  } catch (error) {
    console.error("Error updating resetcount:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message || "An unexpected error occurred",
    });
  }
});

// PUT /toggletimer - Toggle timer state
app.put("/toggletimer", async (req, res) => {
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
    if (!scoreboard) {
      return res.status(404).json({ error: "Scoreboard not found" });
    }
    const updatedScoreboard = await prisma.scoreboard.update({
      where: { id: scoreboard.id },
      data: { timerRunning: !scoreboard.timerRunning },
    });
    res.json(updatedScoreboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle timer" });
  }
});

// PUT /stoptimer - Stop the timer
app.put("/stoptimer", async (req, res) => {
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
    if (!scoreboard) {
      return res.status(404).json({ error: "Scoreboard not found" });
    }
    const updatedScoreboard = await prisma.scoreboard.update({
      where: { id: scoreboard.id },
      data: { timerRunning: false },
    });
    res.json(updatedScoreboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to stop timer" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
