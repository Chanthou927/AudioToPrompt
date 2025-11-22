export interface AudioFile {
  file: File;
  previewUrl: string;
}

export interface GeneratedPrompt {
  text: string;
  timestamp: Date;
}

export interface AppState {
  isLoading: boolean;
  error: string | null;
  audioFile: AudioFile | null;
  result: GeneratedPrompt | null;
}

export const SUPPORTED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/x-m4a',
  'audio/mp4', // often m4a container
  'audio/aac',
  'audio/ogg'
];