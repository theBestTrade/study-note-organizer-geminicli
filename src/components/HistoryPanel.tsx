import React from 'react';
import { X, Trash2, Calendar, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { HistoryItem } from '../types';

export const HistoryPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();

  if (!state.isHistoryOpen) return null;

  const handleRestore = (item: HistoryItem) => {
    dispatch({ type: 'SET_INPUT_DATE', payload: item.date });
    dispatch({ type: 'SET_INPUT_TEXT', payload: item.inputText });
    dispatch({ type: 'SET_BASE_RESULT_1', payload: item.baseResult1 });
    dispatch({ type: 'SET_BASE_RESULT_2', payload: item.baseResult2 });
    dispatch({ type: 'SET_FINAL_RESULT', payload: item.finalResult });
    dispatch({ type: 'TOGGLE_HISTORY' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = state.history.filter(h => h.id !== id);
    dispatch({ type: 'SET_HISTORY', payload: newHistory });
  };

  const handleDeleteAll = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      dispatch({ type: 'SET_HISTORY', payload: [] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })} />
      <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">최근 히스토리</h2>
          <div className="flex items-center gap-2">
            {state.history.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 transition-colors"
                title="전체 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => dispatch({ type: 'TOGGLE_HISTORY' })} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {state.history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <Calendar className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-sm">히스토리가 없습니다.</p>
            </div>
          ) : (
            state.history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRestore(item)}
                className="group p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {item.formattedDate}
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/40 rounded text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {item.finalResult.keywords.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[10px] text-gray-600 dark:text-gray-400">
                      #{k}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 truncate">
                  <FileText className="w-3 h-3 shrink-0" />
                  {item.inputText}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
