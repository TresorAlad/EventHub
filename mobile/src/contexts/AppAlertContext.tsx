import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AppModalAlert, { AppAlertPayload } from '@/components/AppModalAlert';

type AppAlertContextValue = {
  showAlert: (payload: AppAlertPayload) => void;
  hideAlert: () => void;
};

const AppAlertContext = createContext<AppAlertContextValue | null>(null);

export const AppAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [current, setCurrent] = useState<AppAlertPayload | null>(null);

  const hideAlert = useCallback(() => setCurrent(null), []);

  const showAlert = useCallback((payload: AppAlertPayload) => {
    setCurrent(payload);
  }, []);

  const value = useMemo(() => ({ showAlert, hideAlert }), [showAlert, hideAlert]);

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      <AppModalAlert
        visible={Boolean(current)}
        payload={current}
        onRequestClose={hideAlert}
      />
    </AppAlertContext.Provider>
  );
};

export const useAppAlert = (): AppAlertContextValue => {
  const ctx = useContext(AppAlertContext);
  if (!ctx) {
    throw new Error('useAppAlert doit être appelé à l’intérieur de <AppAlertProvider>');
  }
  return ctx;
};

