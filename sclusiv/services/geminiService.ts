
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSmartCaption = async (content: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve this social media caption to make it more engaging and add relevant hashtags: "${content}"`,
    });
    return response.text || content;
  } catch (error) {
    console.error("Gemini Error:", error);
    return content;
  }
};

export const generateSmartReply = async (lastMessage: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, friendly reply for this chat message: "${lastMessage}"`,
    });
    return response.text || "Nice!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Got it!";
  }
};
