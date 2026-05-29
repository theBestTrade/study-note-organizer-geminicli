import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppSettings, HistoryItem, ModelResult, FinalResult } from '../types';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../utils/constants';

type Action =
  | { type: 'SET_INPUT_DATE'; payload: string }
  | { type: 'SET_INPUT_TEXT'; payload: string }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_BASE_RESULT_1'; payload: ModelResult }
  | { type: 'SET_BASE_RESULT_2'; payload: ModelResult }
  | { type: 'SET_FINAL_RESULT'; payload: FinalResult | null }
  | { type: 'ADD_HISTORY'; payload: HistoryItem }
  | { type: 'SET_HISTORY'; payload: HistoryItem[] }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_HISTORY' }
  | { type: 'RESET_RESULTS' };

const initialState: AppState = {
  inputDate: new Date().toISOString().split('T')[0],
  inputText: '',
  settings: DEFAULT_SETTINGS,
  baseResult1: { modelId: '', modelName: '', content: '', latencyMs: 0, status: 'idle' },
  baseResult2: { modelId: '', modelName: '', content: '', latencyMs: 0, status: 'idle' },
  finalResult: null,
  history: [],
  isSettingsOpen: false,
  isHistoryOpen: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_INPUT_DATE':
      return { ...state, inputDate: action.payload };
    case 'SET_INPUT_TEXT':
      return { ...state, inputText: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_BASE_RESULT_1':
      return { ...state, baseResult1: action.payload };
    case 'SET_BASE_RESULT_2':
      return { ...state, baseResult2: action.payload };
    case 'SET_FINAL_RESULT':
      return { ...state, finalResult: action.payload };
    case 'ADD_HISTORY':
      const newHistory = [action.payload, ...state.history].slice(0, 50);
      return { ...state, history: newHistory };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    case 'TOGGLE_HISTORY':
      return { ...state, isHistoryOpen: !state.isHistoryOpen };
    case 'RESET_RESULTS':
      return {
        ...state,
        baseResult1: { ...initialState.baseResult1 },
        baseResult2: { ...initialState.baseResult2 },
        finalResult: null,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      dispatch({ type: 'SET_SETTINGS', payload: JSON.parse(savedSettings) });
    }

    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) {
      dispatch({ type: 'SET_HISTORY', payload: JSON.parse(savedHistory) });
    }

    const savedDraft = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (savedDraft) {
      const { inputDate, inputText } = JSON.parse(savedDraft);
      if (inputDate) dispatch({ type: 'SET_INPUT_DATE', payload: inputDate });
      if (inputText) dispatch({ type: 'SET_INPUT_TEXT', payload: inputText });
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }, [state.settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify({
      inputDate: state.inputDate,
      inputText: state.inputText,
    }));
  }, [state.inputDate, state.inputText]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
