import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface InputSectionProps {
  onOrganize: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onOrganize, isLoading }) => {
  const { state, dispatch } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [state.inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onOrganize();
    }
  };

  return (
    <section className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              학습 날짜
            </label>
            <input
              id="date"
              type="date"
              value={state.inputDate}
              onChange={(e) => dispatch({ type: 'SET_INPUT_DATE', payload: e.target.value })}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            수업/회의 원문
          </label>
          <textarea
            id="content"
            ref={textareaRef}
            value={state.inputText}
            onChange={(e) => dispatch({ type: 'SET_INPUT_TEXT', payload: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="오늘 수업/회의 내용을 붙여넣으세요 (Ctrl + Enter로 실행)"
            className="w-full min-h-[200px] max-h-[600px] p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none overflow-hidden"
          />
          <div className="absolute bottom-2 right-4 text-xs text-gray-400 dark:text-gray-500">
            {state.inputText.length}자
          </div>
        </div>

        <button
          onClick={onOrganize}
          disabled={isLoading || !state.inputText.trim()}
          className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform active:scale-[0.98]"
        >
          <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? '정리 중...' : '학습 일지 정리하기'}
        </button>
      </div>
    </section>
  );
};
