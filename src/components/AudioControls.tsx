import React from "react";

interface AudioControlsProps {
  audioBlob?: Blob;
  onPlay: () => void;
  onDownload: () => void;
  isPlaying: boolean;
  disabled?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  audioBlob,
  onPlay,
  onDownload,
  isPlaying,
  disabled = false,
}) => {
  if (!audioBlob) return null;

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={onPlay}
        disabled={disabled || isPlaying}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isPlaying ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            재생 중...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5v10l8-5-8-5z" />
            </svg>
            음성 재생
          </>
        )}
      </button>

      <button
        onClick={onDownload}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
        </svg>
        음성 다운로드
      </button>
    </div>
  );
};
