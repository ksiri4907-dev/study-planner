import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization helper for GoogleGenAI
function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Helath Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// 2. Gemini AI tutor support: Explain concept, output code, or trace dry-run
app.post("/api/gemini/explain", async (req, res) => {
  try {
    const { day, topic, task, type } = req.body;
    if (!day || !topic || !task || !type) {
      return res.status(400).json({ error: "Missing required fields: day, topic, task, type." });
    }

    const ai = getAI();

    let systemInstruction = "You are a warm, highly encouraging, and empathetic Computer Science and AIML professor acting as a personal study mentor.";
    let prompt = "";

    if (type === "concept") {
      prompt = `Explain the following machine learning/python topic step-by-step to a beginner student:
Topic: "${topic}"
Current Goal (Day ${day}): "${task}"

Guidelines:
1. Keep explanation simple, avoiding high-level math/jargon unless clearly explained with a humble analogy.
2. Provide step-by-step intuitive blocks.
3. Be friendly and highly empathetic (e.g., say something like "Don't sweat it if this sounds like a lot—we will break it down together!").`;
    } else if (type === "code") {
      prompt = `Provide a beautiful, highly clean, and production-ready Python code example for the following student task:
Topic: "${topic}"
Study Task (Day ${day}): "${task}"

Guidelines:
1. Provide a self-contained, working python script with plenty of intuitive line-by-line comments.
2. Do not use complex libraries yet (prefer standard library structures or explain NumPy/Pandas clearly if necessary).
3. Include brief instructions on how the student can test or run the code on their own computer.`;
    } else if (type === "dryrun") {
      prompt = `Create an interactive ASCII Dry-Run execution trace table for a short, relevant Python code block covering the topic: "${topic}" (Day ${day} Task: "${task}").

Guidelines:
1. First, provide a small 3-8 line Python code snippet.
2. Directly below the code, render an elegant ASCII table with columns such as: Line Number | Variable (Value) | State Check / Condition | Explanation.
3. Explain the exact mechanism step-by-step.
4. Show how recursion, loops, or conditional changes affect each state element.`;
    } else {
      return res.status(400).json({ error: "Invalid explanation type requested." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini Explain Error:", error);
    res.status(500).json({ error: error?.message || "An error occurred while generating tutor feedback." });
  }
});

// 3. Gemini AI Smart Adaptability Router: Re-order / merge topics if user is falling behind
app.post("/api/gemini/adapt", async (req, res) => {
  try {
    const { currentDay, uncompletedTopics, comments } = req.body;
    if (!currentDay || !uncompletedTopics || !Array.isArray(uncompletedTopics)) {
      return res.status(400).json({ error: "Missing required fields: currentDay, uncompletedTopics list." });
    }

    const ai = getAI();

    const prompt = `The AIML computer science student is on Day ${currentDay} of a 30-day study plan but is falling behind.
We need to merge, simplify, or reorganize all remaining items to fit the remaining period (from Day ${currentDay} up to Day 30).
The remaining topics waiting to be mastered are:
${JSON.stringify(uncompletedTopics)}

Student feedback / struggles:
"${comments || "No comments, just need a streamlined schedule."}"

Construct an adjusted, highly realistic daily schedule from Day ${currentDay} to Day 30.
For each day in this remaining window, determine:
- What topic should they learn? (Feel free to combine closely related concepts or split a difficult topic into logical smaller steps)
- What practical task should they accomplish?
- What micro-guidelines or notes must they keep in mind?
- An encouraging, personalized motivational message.
- An optional challenge task.

Output must be a JSON array of days.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of modified daily plans",
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "The day number, ranging from currentDay to 30." },
              topic: { type: Type.STRING, description: "Streamlined, adjusted topic name." },
              task: { type: Type.STRING, description: "Concrete coding task or exercise." },
              notes: { type: Type.STRING, description: "Notes, tips, or guidelines." },
              motivation: { type: Type.STRING, description: "An empathetic, personalized encouragement note." },
              challenge: { type: Type.STRING, description: "An optional challenge task for faster paced days." }
            },
            required: ["day", "topic", "task", "notes", "motivation", "challenge"]
          }
        },
        systemInstruction: "You are a friendly, deeply empathetic study planning advisor. You rearrange educational schedules to prevent burnout and assure success.",
        temperature: 0.6,
      }
    });

    const parsedPlan = JSON.parse(response.text.trim());
    res.json({ updatedPlan: parsedPlan });
  } catch (error: any) {
    console.error("Gemini Adaptation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to adapt study schedule dynamically." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully running on http://localhost:${PORT}`);
  });
}

startServer();
