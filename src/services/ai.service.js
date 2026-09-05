import { GoogleGenAI } from "@google/genai";
import { config } from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

export async function generateQuiz(topic, length, difficulty, format) {
    const prompt = `Generate a quiz about the following topic/prompt: "${topic}". 
    Number of questions: ${length}. 
    Difficulty level: ${difficulty}. 
    Question format requirement: ${format} (options can be 4 choices for multiple choice, or True/False options for true/false).`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                systemInstruction: `You are an expert quiz generator API. 
You must return ONLY a valid JSON array of objects. Do not include markdown code blocks (like \`\`\`json) or any extra text outside the JSON.
Each object in the array must strictly follow this exact structure:
{
    "question": "The question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The exact correct option string",
    "userSelected": ""
}`,
                responseMimeType: "application/json"
            }
        });
    
        // Parse and return the JSON array safely
        const rawText = response.text.trim();
        // Fallback clean in case markdown tags somehow slip through
        const cleanJson = rawText.replace(/^```json\s*([\s\S]*?)\s*```$/, '$1');
        
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Generation Error details:", error);
        throw new Error(`Failed to generate quiz: ${error.message}`);
    }
}
