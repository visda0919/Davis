import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const chatWithGemini = async (
  message: string, 
  history: { role: 'user' | 'model'; content: string }[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // We use gemini-3-pro-preview for complex financial reasoning
    const modelId = "gemini-3-pro-preview";
    
    const chat = ai.chats.create({
      model: modelId,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }],
      })),
      config: {
        systemInstruction: "You are an expert financial analyst specializing in Taiwan and US stock markets. Provide concise, data-driven insights. Use 'Red' to describe price increases and 'Green' for decreases (Taiwan convention) when discussing Taiwan stocks, but clarify if discussing US stocks (Green up, Red down). If uncertain, stick to neutral terms like 'Bullish' or 'Bearish'.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error connecting to the financial AI brain.";
  }
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const modelId = "gemini-3-pro-preview"; // Excellent for multimodal tasks

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from base64
              data: base64Image,
            },
          },
          {
            text: prompt || "Analyze this financial chart or document. Identify key trends, support/resistance levels, or key financial figures.",
          },
        ],
      },
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Failed to analyze the image.";
  }
};
