import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MODEL_OPTIONS } from '../utils/constants';

export const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [baseModel1, setBaseModel1] = useState(state.settings.baseModel1);
  const [baseModel2, setBaseModel2] = useState(state.settings.baseModel2);
  const [mergeModel, setMergeModel] = useState(state.settings.mergeModel);

  if (!state.isSettingsOpen) return null;

  const handleSave = () => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: {
        ...state.settings,
        baseModel1,
        baseModel2,
        mergeModel,
      },
    });
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  const isFreeModel = (id: string) => MODEL_OPTIONS.find(m => m.id === id)?.isFree;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })} />
      <div className="relative w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">설정</h2>
          <button onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">OpenRouter API Key는 서버 환경변수 OPENROUTER_API_KEY로 관리합니다. 브라우저에 입력하거나 저장하지 않습니다.</p>

          {/* Model Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">기본 모델 1</label>
              <select
                value={baseModel1}
                onChange={(e) => setBaseModel1(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name} {opt.isFree ? '(Free)' : ''}</option>
                ))}
              </select>
              {isFreeModel(baseModel1) && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="w-3 h-3" />
                  무료 모델은 품질이나 속도가 저하될 수 있습니다.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">기본 모델 2</label>
              <select
                value={baseModel2}
                onChange={(e) => setBaseModel2(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name} {opt.isFree ? '(Free)' : ''}</option>
                ))}
              </select>
              {isFreeModel(baseModel2) && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="w-3 h-3" />
                  무료 모델은 품질이나 속도가 저하될 수 있습니다.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">통합 모델</label>
              <select
                value={mergeModel}
                onChange={(e) => setMergeModel(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {MODEL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name} {opt.isFree ? '(Free)' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
