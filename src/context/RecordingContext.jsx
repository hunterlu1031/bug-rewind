import { createContext, useContext } from 'react';
import { useRecording } from '../hooks/useRecording';

const RecordingContext = createContext(null);

export function RecordingProvider({ children }) {
  const value = useRecording();
  return (
    <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>
  );
}

export function useRecordingContext() {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error('useRecordingContext must be used within RecordingProvider');
  return ctx;
}
