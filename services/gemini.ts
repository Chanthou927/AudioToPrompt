import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const API_KEY = process.env.API_KEY;

// Initialize client
// Note: We create a new instance per request in components usually if key changes, 
// but here the key is static env var, so global instance is fine unless we implement key picker.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePromptFromAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("API Key not found. Please check your environment configuration.");
    }

    // Fallback MIME type if browser reports empty string (common with some OS/Extension combos)
    const finalMimeType = mimeType || 'audio/mp3';

    const modelId = 'gemini-2.5-flash';
    
    const systemInstruction = `
      You are an expert audio engineer and creative prompt writer. 
      Your task is to listen to the audio file provided and generate a highly descriptive text prompt that could be used to regenerate this sound or describe it perfectly to another AI model (like a text-to-audio or text-to-music model).
      
      Focus on:
      1. Genre and Style.
      2. Instrumentation (specific synths, drums, acoustic instruments).
      3. Mood and Atmosphere.
      4. Tempo and Rhythm.
      5. Technical characteristics (lo-fi, reverb-heavy, dry, clean, distorted).
      
      Output ONLY the descriptive prompt text. Do not add conversational filler like "Here is the prompt:".
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: finalMimeType,
                data: audioBase64
              }
            },
            {
              text: "Describe this audio sound in detail."
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more precise descriptive accuracy
        maxOutputTokens: 1000,
      }
    });

    const text = response.text;
    if (!text) {
      console.error("Gemini API Empty Response:", JSON.stringify(response, null, 2));
      
      // Check for specific finish reasons if available in the response structure
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
             throw new Error(`Model stopped generating. Reason: ${candidate.finishReason}`);
        }
      }
      
      throw new Error("No text generated from the model. The audio might be unclear, silent, or triggered safety filters.");
    }

    return text.trim();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Improve error message for user
    if (error.message?.includes('API_KEY')) {
      throw new Error("Invalid or missing API Key.");
    }
    if (error.message?.includes('413')) {
        throw new Error("File is too large for the API processing.");
    }
    throw error;
  }
};