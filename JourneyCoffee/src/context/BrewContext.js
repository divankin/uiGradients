import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Brew context holds the in-progress brew session state.
 * Persists across navigation so users can leave and return.
 */
const BrewContext = createContext(null);

const INITIAL_BREW_STATE = {
  isActive: false,
  recipe: null,
  bean: null,
  coffeeAmount: 0,
  waterAmount: 0,
  ratio: 0,
  roastLevel: 'medium',
  grindSize: 'medium',
  tempCelsius: 93,
  timerMode: true,
  currentStepIndex: 0,
  isPaused: false,
  elapsedSeconds: 0,
  stepElapsedSeconds: 0,
  customPours: null, // for 4:6 manual locks
};

export function BrewProvider({ children }) {
  const [brewState, setBrewState] = useState(INITIAL_BREW_STATE);

  const startBrew = useCallback((params) => {
    setBrewState({
      ...INITIAL_BREW_STATE,
      isActive: true,
      recipe: params.recipe,
      bean: params.bean || null,
      coffeeAmount: params.coffeeAmount,
      waterAmount: params.waterAmount,
      ratio: params.ratio,
      roastLevel: params.roastLevel,
      grindSize: params.grindSize,
      tempCelsius: params.tempCelsius,
      timerMode: params.timerMode,
      customPours: params.customPours || null,
    });
  }, []);

  const nextStep = useCallback(() => {
    setBrewState((prev) => {
      if (!prev.recipe) return prev;
      const maxIndex = prev.recipe.steps.length - 1;
      if (prev.currentStepIndex >= maxIndex) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1, stepElapsedSeconds: 0 };
    });
  }, []);

  const prevStep = useCallback(() => {
    setBrewState((prev) => {
      if (prev.currentStepIndex <= 0) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex - 1, stepElapsedSeconds: 0 };
    });
  }, []);

  const togglePause = useCallback(() => {
    setBrewState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const toggleTimerMode = useCallback(() => {
    setBrewState((prev) => ({ ...prev, timerMode: !prev.timerMode }));
  }, []);

  const tickTimer = useCallback(() => {
    setBrewState((prev) => {
      if (!prev.isActive || prev.isPaused) return prev;
      return {
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
        stepElapsedSeconds: prev.stepElapsedSeconds + 1,
      };
    });
  }, []);

  const resetBrew = useCallback(() => {
    setBrewState(INITIAL_BREW_STATE);
  }, []);

  const restartBrew = useCallback(() => {
    setBrewState((prev) => ({
      ...prev,
      currentStepIndex: 0,
      isPaused: false,
      elapsedSeconds: 0,
      stepElapsedSeconds: 0,
    }));
  }, []);

  return (
    <BrewContext.Provider
      value={{
        brewState,
        startBrew,
        nextStep,
        prevStep,
        togglePause,
        toggleTimerMode,
        tickTimer,
        resetBrew,
        restartBrew,
      }}
    >
      {children}
    </BrewContext.Provider>
  );
}

export function useBrew() {
  const ctx = useContext(BrewContext);
  if (!ctx) throw new Error('useBrew must be used within BrewProvider');
  return ctx;
}
