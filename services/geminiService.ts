import { GoogleGenAI } from "@google/genai";
import { CodeLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceCode = async (
  code: string, 
  language: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert code formatter and educator. 
      Task: Refactor the following ${language} code to be cleaner, more idiomatic, and easier to read for a presentation.
      
      Requirements:
      1. Fix indentation and spacing.
      2. Add brief, helpful comments for key logic (do not over-comment).
      3. Keep variable names concise but descriptive.
      4. RETURN ONLY THE RAW CODE STRING. Do not include markdown code fences (like \`\`\`) or any introductory text.
      
      Code:
      ${code}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text || code;
    
    // Cleanup if model accidentally adds markdown fences
    text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
    
    return text.trim();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to enhance code. Please check your network.");
  }
};

export const explainCode = async (code: string): Promise<string> => {
  try {
    const prompt = `
      Explain the following code in one short paragraph suitable for a slide speaker note.
      Code:
      ${code}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error(error);
    return "";
  }
};