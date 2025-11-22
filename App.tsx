import React, { useState, useCallback } from 'react';
import { AudioFile, AppState, GeneratedPrompt } from './types';
import { fileToBase64, validateAudioFile } from './utils/fileHelpers';
import { generatePromptFromAudio } from './services/gemini';
import { FileUploader } from './components/FileUploader';
import { Header } from './components/Header';
import { ResultCard } from './components/ResultCard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorBanner } from './components/ErrorBanner';
import { Info as InfoIcon } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoading: false,
    error: null,
    audioFile: null,
    result: null,
  });

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      // Validate
      const validationError = validateAudioFile(file);
      if (validationError) {
        setState(prev => ({ ...prev, error: validationError }));
        return;
      }

      // Reset state for new file
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        audioFile: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
        result: null,
      }));

      // Convert to Base64
      const base64Data = await fileToBase64(file);
      
      // Call Gemini API
      const promptText = await generatePromptFromAudio(base64Data, file.type);

      setState(prev => ({
        ...prev,
        isLoading: false,
        result: {
          text: promptText,
          timestamp: new Date(),
        },
      }));

    } catch (err: any) {
      console.error("Processing error:", err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred while processing the audio.",
      }));
    }
  }, []);

  const handleReset = () => {
    if (state.audioFile?.previewUrl) {
      URL.revokeObjectURL(state.audioFile.previewUrl);
    }
    setState({
      isLoading: false,
      error: null,
      audioFile: null,
      result: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-300">
                1. Upload Audio
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Upload an MP3, M4A, or WAV file. Gemini will analyze the sonic characteristics, 
                mood, and instrumentation to generate a detailed text prompt.
              </p>
              
              <FileUploader 
                onFileSelect={handleFileSelect} 
                currentFile={state.audioFile?.file || null}
                disabled={state.isLoading}
              />

              {state.audioFile && (
                <div className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-slate-700">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono text-slate-500 uppercase">Preview</span>
                      <button 
                        onClick={handleReset}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                        disabled={state.isLoading}
                      >
                        Remove
                      </button>
                   </div>
                   <audio 
                    controls 
                    src={state.audioFile.previewUrl} 
                    className="w-full h-8"
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 flex gap-3 items-start">
              <InfoIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Pro Tip</p>
                <p className="opacity-80">
                  Best results are achieved with clear audio recordings. 
                  The model can identify musical genres, specific instruments, emotional tones, 
                  and even describe ambient soundscapes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col gap-6 relative">
            {state.error && (
              <ErrorBanner message={state.error} onClose={() => setState(prev => ({ ...prev, error: null }))} />
            )}
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm min-h-[400px] flex flex-col">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-300">
                2. Generated Prompt
              </h2>
              
              {state.isLoading ? (
                <LoadingOverlay />
              ) : state.result ? (
                <ResultCard prompt={state.result.text} />
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/30">
                  <span className="text-4xl mb-2">✨</span>
                  <p>Upload a file to generate a prompt</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;