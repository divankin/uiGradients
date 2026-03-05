import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, SettingsProvider, BrewProvider } from './src/context';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <BrewProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </BrewProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
