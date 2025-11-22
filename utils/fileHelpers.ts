import { SUPPORTED_MIME_TYPES } from '../types';

export const validateAudioFile = (file: File): string | null => {
  if (!file) return "No file selected.";
  
  // Basic MIME type check (browser dependent, so we permit some flexibility)
  const isAudio = file.type.startsWith('audio/') || 
                  file.name.endsWith('.m4a') || 
                  file.name.endsWith('.mp3') || 
                  file.name.endsWith('.wav') ||
                  file.name.endsWith('.ogg');
  
  if (!isAudio) {
    return `Unsupported file format: ${file.type}. Please upload MP3, M4A, or WAV.`;
  }

  // Size limit: 9.5MB
  // API Inline data limit is 20MB. Base64 encoding adds ~33%.
  // 9.5MB * 1.33 = ~12.6MB. This leaves plenty of headroom for the request body.
  const maxSize = 9.5 * 1024 * 1024; 
  if (file.size > maxSize) {
    return "File size too large. Please upload a file smaller than 9.5MB.";
  }

  return null;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};