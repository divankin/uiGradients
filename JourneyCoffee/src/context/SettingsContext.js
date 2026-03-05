import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_USER_SETTINGS } from '../models';
import { loadSettings, saveSettings } from '../utils/storage';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(DEFAULT_USER_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((stored) => {
      if (stored) setSettingsState({ ...DEFAULT_USER_SETTINGS, ...stored });
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback(
    (updates) => {
      setSettingsState((prev) => {
        const next = { ...prev, ...updates };
        saveSettings(next);
        return next;
      });
    },
    [],
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
