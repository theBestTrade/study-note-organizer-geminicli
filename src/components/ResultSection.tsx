import React from 'react';
import { ResultCard } from './ResultCard';
import { useAppContext } from '../context/AppContext';

interface ResultSectionProps {
  onRetryBase1: () => void;
  onRetryBase2: () => void;
  onRetryFinal: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  onRetryBase1,
  onRetryBase2,
  onRetryFinal,
}) => {
  const { state } = useAppContext();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
      <div className="lg:col-span-1">
        <ResultCard
          title="기본 모델 1"
          result={state.baseResult1}
          onRetry={onRetryBase1}
        />
      </div>
      <div className="lg:col-span-1">
        <ResultCard
          title="기본 모델 2"
          result={state.baseResult2}
          onRetry={onRetryBase2}
        />
      </div>
      <div className="md:col-span-2 lg:col-span-2 flex justify-center mt-4">
        <div className="w-full lg:w-3/4">
          <ResultCard
            title="통합 최종본"
            result={state.finalResult || { modelId: '', modelName: '', content: '', latencyMs: 0, status: 'idle' }}
            onRetry={onRetryFinal}
            isFinal
          />
        </div>
      </div>
    </section>
  );
};
