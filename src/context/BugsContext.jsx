import { createContext, useContext } from 'react';
import { useBugs } from '../hooks/useBugs';

const BugsContext = createContext(null);

export function BugsProvider({ children }) {
  const value = useBugs();
  return <BugsContext.Provider value={value}>{children}</BugsContext.Provider>;
}

export function useBugsContext() {
  const ctx = useContext(BugsContext);
  if (!ctx) throw new Error('useBugsContext must be used within BugsProvider');
  return ctx;
}
