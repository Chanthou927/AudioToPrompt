import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, Music } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, currentFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  // Dynamic styles based on state
  const borderColor = isDragging ? 'border-indigo-500' : 'border-slate-600';
  const bgColor = isDragging ? 'bg-slate-800' : currentFile ? 'bg-slate-800/30' : 'bg-slate-900/50';
  const hoverStyle = disabled ? '' : 'hover:border-indigo-400 hover:bg-slate-800 transition-all duration-200 cursor-pointer';

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 
        flex flex-col items-center justify-center text-center 
        min-h-[200px] ${borderColor} ${bgColor} ${hoverStyle}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="audio/mp3,audio/wav,audio/x-m4a,audio/mpeg,audio/*"
        className="hidden"
        disabled={disabled}
      />

      {currentFile ? (
        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Music className="w-8 h-8" />
          </div>
          <div>
            <p className="font-medium text-indigo-200">{currentFile.name}</p>
            <p className="text-sm text-slate-400">{(currentFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-2 bg-emerald-500/10 py-1 px-3 rounded-full">
            Ready to Analyze
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className={`p-4 rounded-full bg-slate-800 ${isDragging ? 'text-indigo-400 scale-110' : 'text-slate-500' } transition-transform`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-slate-300">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-500">MP3, WAV, or M4A (Max 20MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};