import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useAppContext } from './context/AppContext';
import { useOpenRouter } from './hooks/useOpenRouter';
import { buildBasePrompt, buildMergePrompt } from './utils/prompts';
import { formatDate, extractKeywords } from './utils/formatters';
import { MODEL_OPTIONS } from './utils/constants';
import type { HistoryItem } from './types';

const App: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { callModel } = useOpenRouter(state.settings.apiKey);
  const [isLoading, setIsLoading] = useState(false);

  const getModelName = (id: string) => MODEL_OPTIONS.find(m => m.id === id)?.name || id;

  const handleOrganize = useCallback(async () => {
    if (!state.settings.apiKey) {
      alert('설정에서 API Key를 입력해주세요.');
      dispatch({ type: 'TOGGLE_SETTINGS' });
      return;
    }

    if (!state.inputText.trim()) return;

    setIsLoading(true);
    dispatch({ type: 'RESET_RESULTS' });

    const { month, day, weekday } = formatDate(state.inputDate);
    const basePrompt = buildBasePrompt(state.inputText, month, day, weekday);

    // Step 1: Call base models in parallel
    dispatch({ type: 'SET_BASE_RESULT_1', payload: { ...state.baseResult1, status: 'loading', modelName: getModelName(state.settings.baseModel1) } });
    dispatch({ type: 'SET_BASE_RESULT_2', payload: { ...state.baseResult2, status: 'loading', modelName: getModelName(state.settings.baseModel2) } });

    const [res1, res2] = await Promise.all([
      callModel(state.settings.baseModel1, getModelName(state.settings.baseModel1), basePrompt),
      callModel(state.settings.baseModel2, getModelName(state.settings.baseModel2), basePrompt),
    ]);

    dispatch({ type: 'SET_BASE_RESULT_1', payload: res1 });
    dispatch({ type: 'SET_BASE_RESULT_2', payload: res2 });

    // Step 2: Call merge model if both base models succeeded
    if (res1.status === 'success' && res2.status === 'success') {
      dispatch({ 
        type: 'SET_FINAL_RESULT', 
        payload: { 
          modelId: state.settings.mergeModel, 
          modelName: getModelName(state.settings.mergeModel), 
          content: '', 
          latencyMs: 0, 
          status: 'loading',
          keywords: ['','']
        } 
      });

      const mergePrompt = buildMergePrompt(res1.content, res2.content);
      const mergeRes = await callModel(state.settings.mergeModel, getModelName(state.settings.mergeModel), mergePrompt);

      if (mergeRes.status === 'success') {
        const keywords = extractKeywords(mergeRes.content);
        const finalResult = { ...mergeRes, keywords };
        dispatch({ type: 'SET_FINAL_RESULT', payload: finalResult });

        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          date: state.inputDate,
          formattedDate: `${month}월 ${day}일(${weekday})`,
          inputText: state.inputText,
          baseResult1: res1,
          baseResult2: res2,
          finalResult: finalResult,
          timestamp: Date.now(),
        };
        dispatch({ type: 'ADD_HISTORY', payload: historyItem });
      } else {
        dispatch({ 
          type: 'SET_FINAL_RESULT', 
          payload: { ...mergeRes, keywords: ['정리', '수업'] } 
        });
      }
    }

    setIsLoading(false);
  }, [state.settings, state.inputText, state.inputDate, callModel, dispatch]);

  const handleRetryBase1 = async () => {
    if (isLoading) return;
    const { month, day, weekday } = formatDate(state.inputDate);
    const basePrompt = buildBasePrompt(state.inputText, month, day, weekday);
    
    dispatch({ type: 'SET_BASE_RESULT_1', payload: { ...state.baseResult1, status: 'loading' } });
    const res = await callModel(state.settings.baseModel1, getModelName(state.settings.baseModel1), basePrompt);
    dispatch({ type: 'SET_BASE_RESULT_1', payload: res });
  };

  const handleRetryBase2 = async () => {
    if (isLoading) return;
    const { month, day, weekday } = formatDate(state.inputDate);
    const basePrompt = buildBasePrompt(state.inputText, month, day, weekday);
    
    dispatch({ type: 'SET_BASE_RESULT_2', payload: { ...state.baseResult2, status: 'loading' } });
    const res = await callModel(state.settings.baseModel2, getModelName(state.settings.baseModel2), basePrompt);
    dispatch({ type: 'SET_BASE_RESULT_2', payload: res });
  };

  const handleRetryFinal = async () => {
    if (isLoading || state.baseResult1.status !== 'success' || state.baseResult2.status !== 'success') return;
    
    dispatch({ 
      type: 'SET_FINAL_RESULT', 
      payload: state.finalResult ? { ...state.finalResult, status: 'loading' } : null 
    });
    
    const mergePrompt = buildMergePrompt(state.baseResult1.content, state.baseResult2.content);
    const mergeRes = await callModel(state.settings.mergeModel, getModelName(state.settings.mergeModel), mergePrompt);
    
    if (mergeRes.status === 'success') {
      const keywords = extractKeywords(mergeRes.content);
      dispatch({ type: 'SET_FINAL_RESULT', payload: { ...mergeRes, keywords } });
    } else {
      dispatch({ type: 'SET_FINAL_RESULT', payload: { ...mergeRes, keywords: ['정리', '수업'] } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <InputSection onOrganize={handleOrganize} isLoading={isLoading} />
        
        <ResultSection
          onRetryBase1={handleRetryBase1}
          onRetryBase2={handleRetryBase2}
          onRetryFinal={handleRetryFinal}
        />
      </main>

      <SettingsPanel />
      <HistoryPanel />

      <footer className="py-8 text-center text-gray-400 text-xs">
        © 2026 Study Note Organizer. Powered by OpenRouter.
      </footer>
    </div>
  );
};

export default App;
