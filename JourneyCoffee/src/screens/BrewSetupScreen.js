import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { useBrew } from '../context/BrewContext';
import { Button, NumberInput, OptionSelector, Card, SectionHeader } from '../components';
import { SEED_RECIPES } from '../data/recipes';
import { GRIND_SIZES, ROAST_LEVELS } from '../models';
import { recommendTemperatureCelsius, formatTemperature } from '../utils/temperature';
import { formatWaterAmount, formatCoffeeAmount, formatRatio, formatTime } from '../utils/units';
import { spacing } from '../theme/spacing';

export function BrewSetupScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const { theme, typography } = useTheme();
  const { settings } = useSettings();
  const { startBrew } = useBrew();

  const recipe = useMemo(
    () => SEED_RECIPES.find((r) => r.id === recipeId),
    [recipeId],
  );

  const [coffeeAmount, setCoffeeAmount] = useState(recipe.defaultCoffeeAmount);
  const [ratio, setRatio] = useState(recipe.defaultRatio);
  const [roastLevel, setRoastLevel] = useState(
    recipe.suggestedRoastLevels[0] || 'medium',
  );
  const [grindSize, setGrindSize] = useState(recipe.grindRecommendation);
  const [timerMode, setTimerMode] = useState(settings.timerEnabledByDefault);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempOverride, setTempOverride] = useState(null);

  const waterAmount = Math.round(coffeeAmount * ratio);
  const recommendedTemp = recommendTemperatureCelsius(roastLevel, grindSize);
  const displayTemp = tempOverride ?? recommendedTemp;

  // 4:6 flavor bias
  const [flavorBias, setFlavorBias] = useState(recipe.flavorBias || 'balanced');

  const handleStartBrew = useCallback(() => {
    startBrew({
      recipe,
      coffeeAmount,
      waterAmount,
      ratio,
      roastLevel,
      grindSize,
      tempCelsius: displayTemp,
      timerMode,
      customPours: null,
    });
    navigation.navigate('BrewSession');
  }, [recipe, coffeeAmount, waterAmount, ratio, roastLevel, grindSize, displayTemp, timerMode]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.h1}>{recipe.name}</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          {recipe.description}
        </Text>
      </View>

      <SectionHeader title="Coffee Amount" />
      <View style={styles.section}>
        <NumberInput
          value={coffeeAmount}
          unit="g"
          onIncrement={() => setCoffeeAmount((v) => v + 1)}
          onDecrement={() => setCoffeeAmount((v) => Math.max(5, v - 1))}
        />
      </View>

      <SectionHeader title="Ratio" />
      <View style={styles.section}>
        <NumberInput
          value={ratio}
          unit={`(1:${ratio})`}
          onIncrement={() => setRatio((v) => Math.min(20, v + 1))}
          onDecrement={() => setRatio((v) => Math.max(10, v - 1))}
        />
      </View>

      <SectionHeader title="Roast Level" />
      <View style={styles.section}>
        <OptionSelector
          options={ROAST_LEVELS}
          selectedValue={roastLevel}
          onSelect={setRoastLevel}
        />
      </View>

      <SectionHeader title="Grind Size" />
      <View style={styles.section}>
        <OptionSelector
          options={GRIND_SIZES}
          selectedValue={grindSize}
          onSelect={setGrindSize}
        />
        <Text style={[typography.caption, { marginTop: spacing.xs }]}>
          {recipe.grindGuidanceText}
        </Text>
      </View>

      {recipe.is46Style && (
        <>
          <SectionHeader title="Flavor Bias (4:6)" />
          <View style={styles.section}>
            <OptionSelector
              options={[
                { value: 'sweetness', label: 'More Sweetness', description: 'Rounder, fuller cup' },
                { value: 'balanced', label: 'Balanced', description: 'Equal extraction' },
                { value: 'clarity', label: 'More Clarity', description: 'Brighter, cleaner cup' },
              ]}
              selectedValue={flavorBias}
              onSelect={setFlavorBias}
            />
          </View>
        </>
      )}

      <SectionHeader title="Timer" />
      <View style={styles.section}>
        <OptionSelector
          options={[
            { value: true, label: 'Timer On', description: 'Guided countdown per step' },
            { value: false, label: 'No Timer', description: 'Manual step advancement' },
          ]}
          selectedValue={timerMode}
          onSelect={setTimerMode}
        />
      </View>

      {showAdvanced && (
        <>
          <SectionHeader title="Temperature Override" />
          <View style={styles.section}>
            <NumberInput
              value={displayTemp}
              unit={settings.unitSystem === 'imperial' ? '\u00B0F' : '\u00B0C'}
              onIncrement={() => setTempOverride((tempOverride ?? recommendedTemp) + 1)}
              onDecrement={() => setTempOverride(Math.max(75, (tempOverride ?? recommendedTemp) - 1))}
            />
            <Text style={typography.caption}>
              Recommended: {formatTemperature(recommendedTemp, settings.unitSystem)}
            </Text>
          </View>
        </>
      )}

      <Button
        title={showAdvanced ? 'Hide Advanced' : 'Advanced Options'}
        variant="ghost"
        size="small"
        onPress={() => setShowAdvanced(!showAdvanced)}
        style={{ marginHorizontal: spacing.md, marginTop: spacing.sm }}
      />

      {/* Confirmation summary */}
      <Card style={styles.summaryCard}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Brew Summary
        </Text>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Coffee</Text>
          <Text style={typography.h3}>{formatCoffeeAmount(coffeeAmount, settings.unitSystem)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Water</Text>
          <Text style={typography.h3}>{formatWaterAmount(waterAmount, settings.unitSystem)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Ratio</Text>
          <Text style={typography.h3}>{formatRatio(ratio)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Grind</Text>
          <Text style={typography.h3}>{grindSize}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Temperature</Text>
          <Text style={typography.h3}>{formatTemperature(displayTemp, settings.unitSystem)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={typography.body}>Target Time</Text>
          <Text style={typography.h3}>{formatTime(recipe.totalTimeTargetSec)}</Text>
        </View>
      </Card>

      <Button
        title="Start Brewing"
        variant="primary"
        size="large"
        onPress={handleStartBrew}
        style={styles.brewButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl + spacing.xxl },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.md,
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  brewButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
});
