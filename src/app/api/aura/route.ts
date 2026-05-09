import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    // If no API key, we return a flag so the frontend can fallback to local generation
    return NextResponse.json({ error: "NO_API_KEY" }, { status: 401 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a mystical aura reading AI for a luxury birthday website.
  Generate a unique "Aura" profile that feels premium, ethereal, and deeply personal.
  
  Return ONLY a valid JSON object with the following structure:
  {
    "name": "Creative Aura Name",
    "description": "A poetic 1-2 sentence description about their spiritual vibration.",
    "color": "Tailwind gradient classes (e.g., 'from-violet-500 via-fuchsia-500 to-indigo-500')",
    "glow": "Tailwind shadow class matching the color (e.g., 'shadow-fuchsia-500/50')",
    "traits": ["Trait1", "Trait2", "Trait3"],
    "energyType": "A mystical category name",
    "message": "A deep, personal cosmic message for the year ahead.",
    "stats": [
      {"label": "Intuition", "value": 85},
      {"label": "Vitality", "value": 92},
      {"label": "Harmony", "value": 78},
      {"label": "Frequency", "value": "432.4Hz"}
    ]
  }
  
  Avoid clichés. Make it sound like modern high-end spiritualism.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean text in case AI returns markdown
    let jsonStr = text.replace(/```json|```/g, "").trim();
    
    // In case the AI still included some conversational text before/after JSON
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
    }

    const data = JSON.parse(jsonStr);
    
    // Validation: ensure required fields exist
    const required = ["name", "description", "color", "glow", "traits", "stats"];
    for (const field of required) {
      if (!data[field]) throw new Error(`Missing field: ${field}`);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
