import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Role } from "../types";

// Ensure API key is available
if (!process.env.API_KEY) {
  console.error("Missing API_KEY in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_CHAT = 'gemini-2.5-flash';
const MODEL_VISION = 'gemini-2.5-flash';

// Initialize a chat session
let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: MODEL_CHAT,
      config: {
        systemInstruction: "You are a helpful, concise, and friendly AI assistant. Use Markdown for formatting.",
      },
    });
  }
  return chatSession;
};

export const resetChatSession = () => {
  chatSession = null;
};

export const sendChatMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const chat = getChatSession();
  let fullText = "";

  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
        onChunk(fullText);
      }
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }

  return fullText;
};

export const analyzeImageStream = async (
  base64Image: string,
  prompt: string,
  mimeType: string,
  onChunk: (text: string) => void
): Promise<string> => {
  let fullText = "";

  try {
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContentStream({
      model: MODEL_VISION,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: prompt || "Describe this image in detail."
          }
        ]
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk(fullText);
      }
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }

  return fullText;
};

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};