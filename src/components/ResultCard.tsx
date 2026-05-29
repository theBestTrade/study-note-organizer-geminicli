import React from 'react';
import { Copy, Download, RotateCcw, Check, Cpu } from 'lucide-react';
import type { ModelResult } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { downloadTxt } from '../utils/download';
import { cleanContent, formatYYMMDD } from '../utils/formatters';
import { useAppContext } from '../context/AppContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultCardProps {
  result: ModelResult;
  onRetry: () => void;
  title: string;
  isFinal?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onRetry, title, isFinal }) => {
  const { state } = useAppContext();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanContent(result.content));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const dateStr = formatYYMMDD(state.inputDate);
    const filename = isFinal && (result as any).keywords
      ? `${dateStr}_${(result as any).keywords[0]}_${(result as any).keywords[1]}.txt`
      : `${dateStr}_${result.modelName.replace(/\s+/g, '_')}.txt`;
    
    downloadTxt(filename, cleanContent(result.content));
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'anthropic': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'google': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'openai': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'deepseek': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4",
      isFinal && "border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/20"
    )}>
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{title}</span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
              {result.modelName || '대기 중...'}
            </h3>
            {result.status === 'success' && (
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", getProviderColor(result.modelName.split(' ')[0]))}>
                {result.modelName.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {result.status === 'success' && (
            <>
              <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" title="복사">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={handleDownload} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" title="다운로드">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={onRetry} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors" title="다시 생성">
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 relative min-h-[200px]">
        {result.status === 'loading' && <LoadingSpinner />}
        {result.status === 'error' && <ErrorDisplay message={result.errorMessage || '알 수 없는 오류'} onRetry={onRetry} />}
        {result.status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <Cpu className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">정리 대기 중</p>
          </div>
        )}
        {result.status === 'success' && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {cleanContent(result.content)}
            </pre>
          </div>
        )}
      </div>

      {/* Footer / Stats */}
      {result.status === 'success' && (
        <div className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            속도: {(result.latencyMs / 1000).toFixed(2)}s
          </span>
          {result.tokenUsage && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              토큰: {result.tokenUsage.total}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
