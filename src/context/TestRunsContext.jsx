import { createContext, useContext } from 'react';
import { useTestRuns } from '../hooks/useTestRuns';

const TestRunsContext = createContext(null);

export function TestRunsProvider({ children }) {
  const value = useTestRuns();
  return (
    <TestRunsContext.Provider value={value}>{children}</TestRunsContext.Provider>
  );
}

export function useTestRunsContext() {
  const ctx = useContext(TestRunsContext);
  if (!ctx) {
    throw new Error('useTestRunsContext must be used within TestRunsProvider');
  }
  return ctx;
}
