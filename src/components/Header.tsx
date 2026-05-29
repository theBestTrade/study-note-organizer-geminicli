import React from 'react';
import { Sun, Moon, Settings, History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

export const Header: React.FC = () => {
  const { dispatch } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">학습 일지 정리기</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title="히스토리"
        >
          <History className="w-5 h-5" />
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          title="설정"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
