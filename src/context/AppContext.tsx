import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import apiClient, { DEMO_USER_ID } from '../api/client';

interface AppState {
  userId: string;
  userName: string;
  bootstrapDone: boolean;
  bootstrapError: string | null;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId] = useState<string>(DEMO_USER_ID);
  const [userName, setUserName] = useState<string>('John');
  const [bootstrapDone, setBootstrapDone] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      try {
        const res = await apiClient.post('/api/profile/bootstrap');
        if (cancelled) return;
        if (res.data?.full_name) setUserName(res.data.full_name.split(' ')[0]);
        setBootstrapDone(true);
      } catch (err: any) {
        if (cancelled) return;
        const msg = err?.response?.data?.detail || err?.message || 'Bootstrap failed';
        setBootstrapError(msg);
        setBootstrapDone(true);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppContext.Provider value={{ userId, userName, bootstrapDone, bootstrapError }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
