import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Card, Button, Tag, SectionHeader } from '../components';
import { SEED_RECIPES } from '../data/recipes';
import { SEED_BEANS } from '../data/beans';
import { recommendTemperatureCelsius, formatTemperature } from '../utils/temperature';
import { formatTime } from '../utils/units';
import { spacing } from '../theme/spacing';

export function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const { theme, typography } = useTheme();
  const { settings } = useSettings();

  const recipe = useMemo(
    () => SEED_RECIPES.find((r) => r.id === recipeId),
    [recipeId],
  );

  const suggestedBeans = useMemo(
    () => (recipe?.suggestedBeanIds || [])
      .map((id) => SEED_BEANS.find((b) => b.id === id))
      .filter(Boolean),
    [recipe],
  );

  const sampleTemp = recipe
    ? recommendTemperatureCelsius(recipe.suggestedRoastLevels[0] || 'medium', recipe.grindRecommendation)
    : 93;

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={typography.h2}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.h1}>{recipe.name}</Text>
        <Text style={[typography.body, { marginTop: spacing.sm }]}>
          {recipe.description}
        </Text>
        <View style={[styles.tagsRow, { marginTop: spacing.md }]}>
          <Tag label={recipe.difficulty} color={theme.accent} selected />
          {recipe.is46Style && <Tag label="4:6 Method" color={theme.primary} selected />}
          {recipe.flavorGoalTags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </View>

      {/* Parameters overview */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Recipe Overview
        </Text>
        <View style={styles.paramGrid}>
          <View style={styles.paramItem}>
            <Text style={typography.caption}>Coffee</Text>
            <Text style={typography.h3}>{recipe.defaultCoffeeAmount}g</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={typography.caption}>Water</Text>
            <Text style={typography.h3}>{recipe.defaultWaterAmount}g</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={typography.caption}>Ratio</Text>
            <Text style={typography.h3}>1:{recipe.defaultRatio}</Text>
          </View>
          <View style={styles.paramItem}>
            <Text style={typography.caption}>Time</Text>
            <Text style={typography.h3}>{formatTime(recipe.totalTimeTargetSec)}</Text>
          </View>
        </View>
      </Card>

      {/* Grind */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Grind
        </Text>
        <Text style={typography.h3}>{recipe.grindRecommendation}</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          {recipe.grindGuidanceText}
        </Text>
      </Card>

      {/* Temperature */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Temperature
        </Text>
        <Text style={typography.h3}>{formatTemperature(sampleTemp, settings.unitSystem)}</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Temperature adjusts dynamically based on roast level and grind size. This is a starting
          recommendation for {recipe.suggestedRoastLevels[0] || 'medium'} roast.
        </Text>
      </Card>

      {/* Steps preview */}
      <SectionHeader title="Steps" />
      {recipe.steps.map((step) => (
        <View key={step.order} style={styles.stepPreview}>
          <View style={[styles.stepDot, { backgroundColor: theme.primary }]} />
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>{step.title}</Text>
            <Text style={[typography.body, { marginTop: 2 }]}>{step.instruction}</Text>
            {step.timerDurationSec && (
              <Text style={[typography.caption, { marginTop: 2, color: theme.primary }]}>
                {formatTime(step.timerDurationSec)}
              </Text>
            )}
          </View>
        </View>
      ))}

      {/* Suggested beans */}
      {suggestedBeans.length > 0 && (
        <>
          <SectionHeader title="Suggested Beans from Journey" />
          {suggestedBeans.map((bean) => (
            <Card
              key={bean.id}
              onPress={() => navigation.navigate('BeansTab', { screen: 'BeanDetail', params: { beanId: bean.id } })}
              style={styles.beanCard}
            >
              <Text style={typography.h3}>{bean.title}</Text>
              <Text style={[typography.caption, { marginTop: 2 }]}>
                {bean.roastLevel} roast
              </Text>
              <View style={[styles.tagsRow, { marginTop: spacing.xs }]}>
                {bean.flavorTags.slice(0, 3).map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </View>
            </Card>
          ))}
        </>
      )}

      <Button
        title="Brew Now"
        variant="primary"
        size="large"
        onPress={() => navigation.navigate('BrewTab', { screen: 'BrewSetup', params: { recipeId: recipe.id } })}
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
    paddingBottom: spacing.md,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  paramGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paramItem: {
    alignItems: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stepPreview: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  beanCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  brewButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
});
