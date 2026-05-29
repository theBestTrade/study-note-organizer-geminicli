import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-sm text-red-600 dark:text-red-400 text-center mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        재시도
      </button>
    </div>
  );
};
