import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useBrew } from '../context/BrewContext';
import { Button } from '../components';
import { formatTime, formatWaterAmount } from '../utils/units';
import { spacing, borderRadius, touchTargets } from '../theme/spacing';

export function BrewSessionScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const { settings } = useSettings();
  const {
    brewState,
    nextStep,
    prevStep,
    togglePause,
    toggleTimerMode,
    tickTimer,
    resetBrew,
    restartBrew,
  } = useBrew();

  const intervalRef = useRef(null);

  // Timer tick
  useEffect(() => {
    if (brewState.timerMode && brewState.isActive && !brewState.isPaused) {
      intervalRef.current = setInterval(tickTimer, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [brewState.timerMode, brewState.isActive, brewState.isPaused]);

  const { recipe, currentStepIndex } = brewState;
  const steps = recipe?.steps || [];
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleFinish = useCallback(() => {
    navigation.replace('BrewComplete');
  }, [navigation]);

  const handleRestart = useCallback(() => {
    Alert.alert(
      'Restart Brew',
      'This will reset the current brew session. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restart', onPress: restartBrew },
      ],
    );
  }, [restartBrew]);

  const handleExit = useCallback(() => {
    Alert.alert(
      'End Brew',
      'Are you sure you want to end this brew session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: () => {
            resetBrew();
            navigation.goBack();
          },
        },
      ],
    );
  }, [resetBrew, navigation]);

  // Auto-advance in timer mode when step timer completes
  useEffect(() => {
    if (
      brewState.timerMode &&
      currentStep?.timerDurationSec &&
      brewState.stepElapsedSeconds >= currentStep.timerDurationSec
    ) {
      if (isLastStep) {
        handleFinish();
      } else {
        nextStep();
      }
    }
  }, [brewState.stepElapsedSeconds, brewState.timerMode]);

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={typography.h2}>No active brew session.</Text>
        <Button
          title="Go to Brew"
          onPress={() => navigation.navigate('BrewTab')}
          style={{ marginTop: spacing.lg }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.divider }]}>
        <View style={styles.topBarLeft}>
          <Text style={typography.h3}>{recipe.name}</Text>
          <Text style={typography.caption}>
            Total: {formatTime(brewState.elapsedSeconds)}
          </Text>
        </View>
        <Button
          title={brewState.timerMode ? 'Timer On' : 'No Timer'}
          variant="ghost"
          size="small"
          onPress={toggleTimerMode}
        />
      </View>

      {/* Steps list */}
      <ScrollView style={styles.stepsContainer} contentContainerStyle={styles.stepsContent}>
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <View
              key={step.order}
              style={[
                styles.stepCard,
                {
                  backgroundColor: isCurrent ? theme.primary : theme.card,
                  borderColor: isCurrent ? theme.primary : theme.cardBorder,
                  opacity: isFuture ? 0.5 : 1,
                },
              ]}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepNumberContainer}>
                  {isPast ? (
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                  ) : (
                    <View
                      style={[
                        styles.stepNumber,
                        {
                          backgroundColor: isCurrent ? 'rgba(255,255,255,0.2)' : theme.inputBackground,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.body,
                          {
                            color: isCurrent ? theme.textOnPrimary : theme.textSecondary,
                            fontWeight: '700',
                          },
                        ]}
                      >
                        {step.order}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text
                    style={[
                      typography.h3,
                      { color: isCurrent ? theme.textOnPrimary : theme.textPrimary },
                    ]}
                  >
                    {step.title}
                  </Text>
                </View>
                {step.waterAddAmount > 0 && (
                  <View style={styles.waterBadge}>
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: isCurrent ? theme.textOnPrimary : theme.primary,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      +{formatWaterAmount(step.waterAddAmount, settings.unitSystem)}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  typography.body,
                  {
                    color: isCurrent ? theme.textOnPrimary : theme.textSecondary,
                    marginTop: spacing.xs,
                    opacity: isPast ? 0.7 : 1,
                  },
                ]}
              >
                {step.instruction}
              </Text>

              <View style={styles.stepMeta}>
                {step.cumulativeWaterTarget > 0 && (
                  <Text
                    style={[
                      typography.caption,
                      { color: isCurrent ? 'rgba(255,255,255,0.8)' : theme.textMuted },
                    ]}
                  >
                    Total water: {formatWaterAmount(step.cumulativeWaterTarget, settings.unitSystem)}
                  </Text>
                )}
                {isCurrent && brewState.timerMode && step.timerDurationSec && (
                  <Text
                    style={[
                      typography.h2,
                      { color: theme.textOnPrimary, marginTop: spacing.xs },
                    ]}
                  >
                    {formatTime(Math.max(0, step.timerDurationSec - brewState.stepElapsedSeconds))}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: theme.surface, borderTopColor: theme.divider }]}>
        {brewState.timerMode && (
          <Button
            title={brewState.isPaused ? 'Resume' : 'Pause'}
            variant="outline"
            size="medium"
            onPress={togglePause}
            style={styles.controlButton}
          />
        )}
        <Button
          title="Back"
          variant="ghost"
          size="medium"
          onPress={prevStep}
          disabled={currentStepIndex === 0}
          style={styles.controlButton}
        />
        {isLastStep ? (
          <Button
            title="Finish"
            variant="accent"
            size="medium"
            onPress={handleFinish}
            style={[styles.controlButton, { flex: 2 }]}
          />
        ) : (
          <Button
            title="Next"
            variant="primary"
            size="medium"
            onPress={nextStep}
            style={[styles.controlButton, { flex: 2 }]}
          />
        )}
      </View>

      {/* Bottom actions */}
      <View style={[styles.bottomActions, { backgroundColor: theme.surface }]}>
        <Button title="Restart" variant="ghost" size="small" onPress={handleRestart} />
        <Button title="End Brew" variant="ghost" size="small" onPress={handleExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  topBarLeft: {},
  stepsContainer: { flex: 1 },
  stepsContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  stepCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumberContainer: {
    width: 28,
    alignItems: 'center',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBadge: {
    marginLeft: spacing.sm,
  },
  stepMeta: {
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  controlButton: {
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
