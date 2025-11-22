import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const API_KEY = process.env.API_KEY;

// Initialize client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePromptFromAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("API Key not found. Please check your environment configuration.");
    }

    // Normalize MIME types for better compatibility with Gemini
    let finalMimeType = mimeType || 'audio/mp3';
    if (finalMimeType === 'audio/mp3') finalMimeType = 'audio/mpeg';
    if (finalMimeType === 'audio/x-m4a') finalMimeType = 'audio/mp4';
    if (finalMimeType === 'audio/wav' || finalMimeType === 'audio/x-wav') finalMimeType = 'audio/wav';

    const modelId = 'gemini-2.5-flash';
    
    // Updated instruction to match the requested format and avoid safety blocks
    const systemInstruction = `
      You are an expert AI audio engineer and musicologist.
      Analyze the provided audio file and generate a structured report.

      STRICTLY follow this output format:

      Tempo: [BPM estimate or descriptor, e.g., 120 BPM, Upbeat]
      Key: [Musical key, e.g., C Minor, or 'N/A' for sound effects]
      Vibe: [Comma-separated keywords, e.g., Chill, Lo-fi, Cinematic]
      Mood: [Emotional atmosphere, e.g., Melancholic, Energetic]

      Prompt:
      [A comprehensive, single-paragraph text prompt describing instruments, textures, sound effects, and progression. Do not include the file name or metadata.]

      Important Guidelines:
      - Focus ONLY on sonic characteristics (timbre, rhythm, instrumentation).
      - Do NOT identify the artist or song name (to avoid copyright restrictions/safety blocks).
      - Do NOT refuse to generate if the audio is low quality; describe the quality.
      - If no music is detected, describe the sound (e.g., speech, nature sounds, silence).
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
              text: "Analyze this audio file and provide the report in the requested format."
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for stricter formatting
        // Removed maxOutputTokens limit. The model needs budget for 'thinking' tokens + output.
        // The default limit (usually ~8k for flash) is sufficient and safe.
        
        // Safety settings to prevent blocking on harmless content/lyrics
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      }
    });

    const text = response.text;
    
    if (!text) {
      console.error("Gemini API Empty Response:", JSON.stringify(response, null, 2));
      
      // Detailed error analysis
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
             if (candidate.finishReason === 'MAX_TOKENS') {
                throw new Error("Model stopped generating (Max Tokens). The model used too many tokens for thinking or analysis. Try a shorter audio clip.");
             }
             throw new Error(`Model stopped generating. Reason: ${candidate.finishReason}. The audio might contain safety violations or be too ambiguous.`);
        }
      }
      
      throw new Error("No text generated from the model. The audio might be silent or blocked by safety filters.");
    }

    return text.trim();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes('API_KEY')) {
      throw new Error("Invalid or missing API Key.");
    }
    if (error.message?.includes('413') || error.message?.includes('too large')) {
        throw new Error("File is too large for the API processing. Please try a file smaller than 9.5MB.");
    }
    // Pass through specific errors we threw above
    throw error;
  }
};