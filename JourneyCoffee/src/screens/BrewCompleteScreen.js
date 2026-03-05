import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useBrew } from '../context/BrewContext';
import { Button, Card, Tag, OptionSelector } from '../components';
import { BREW_OUTCOMES, TASTE_TAGS } from '../models';
import { SEED_BEANS } from '../data/beans';
import { suggestBrewAdjustments } from '../utils/recommendations';
import { saveBrewSession } from '../utils/storage';
import { spacing } from '../theme/spacing';

export function BrewCompleteScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const { brewState, resetBrew } = useBrew();

  const [rating, setRating] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [saved, setSaved] = useState(false);

  const suggestions = useMemo(() => {
    if (!outcome) return [];
    return suggestBrewAdjustments({
      outcome,
      tasteTags: selectedTags,
    });
  }, [outcome, selectedTags]);

  // Pick a suggested bean
  const suggestedBean = useMemo(() => {
    if (!brewState.recipe) return null;
    const beanId = brewState.recipe.suggestedBeanIds?.[0];
    return SEED_BEANS.find((b) => b.id === beanId) || SEED_BEANS[0];
  }, [brewState.recipe]);

  const handleSave = useCallback(async () => {
    const session = {
      id: `brew-${Date.now()}`,
      recipeId: brewState.recipe?.id,
      beanId: brewState.bean?.id || null,
      dateTime: new Date().toISOString(),
      coffeeAmount: brewState.coffeeAmount,
      waterAmount: brewState.waterAmount,
      ratio: brewState.ratio,
      roastLevel: brewState.roastLevel,
      grindSize: brewState.grindSize,
      tempCelsius: brewState.tempCelsius,
      unitSystem: 'imperial',
      timerModeUsed: brewState.timerMode,
      rating,
      outcome,
      tasteTags: selectedTags,
    };
    await saveBrewSession(session);
    setSaved(true);
  }, [brewState, rating, outcome, selectedTags]);

  const handleDone = useCallback(() => {
    resetBrew();
    navigation.popToTop();
  }, [resetBrew, navigation]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={48} color={theme.primary} />
        <Text style={[typography.hero, { marginTop: spacing.sm }]}>Brew Complete</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          How did it taste? Your feedback helps us improve recommendations.
        </Text>
      </View>

      {/* Rating */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Rating
        </Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= (rating || 0) ? 'star' : 'star-outline'}
              size={36}
              color={star <= (rating || 0) ? theme.accent : theme.textMuted}
              onPress={() => setRating(star)}
              style={{ marginHorizontal: spacing.xs }}
            />
          ))}
        </View>
      </Card>

      {/* Outcome */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          How was the taste?
        </Text>
        <OptionSelector
          options={BREW_OUTCOMES.map((o) => ({ value: o.id, label: o.label }))}
          selectedValue={outcome}
          onSelect={setOutcome}
        />
      </Card>

      {/* Taste Tags */}
      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Taste Notes
        </Text>
        <View style={styles.tagsRow}>
          {TASTE_TAGS.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              selected={selectedTags.includes(tag)}
              onPress={() => {
                setSelectedTags((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                );
              }}
            />
          ))}
        </View>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card style={styles.card}>
          <Text style={[typography.label, { color: theme.accent, marginBottom: spacing.sm }]}>
            Suggestions for Next Time
          </Text>
          {suggestions.map((s, i) => (
            <View key={i} style={styles.suggestionRow}>
              <Ionicons name="bulb-outline" size={18} color={theme.accent} />
              <Text style={[typography.body, { marginLeft: spacing.sm, flex: 1 }]}>
                {s}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Suggested Bean */}
      {suggestedBean && (
        <Card style={styles.card}>
          <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
            Try This Bean Next
          </Text>
          <Text style={typography.h3}>{suggestedBean.title}</Text>
          <Text style={[typography.body, { marginTop: spacing.xs }]}>
            {suggestedBean.description}
          </Text>
          <View style={[styles.tagsRow, { marginTop: spacing.sm }]}>
            {suggestedBean.flavorTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
          <Button
            title="View Bean"
            variant="outline"
            size="small"
            onPress={() => navigation.navigate('BeansTab', { screen: 'BeanDetail', params: { beanId: suggestedBean.id } })}
            style={{ marginTop: spacing.sm }}
          />
        </Card>
      )}

      {/* Actions */}
      {!saved ? (
        <Button
          title="Save Brew Log"
          variant="primary"
          onPress={handleSave}
          style={styles.actionButton}
        />
      ) : (
        <View style={styles.savedRow}>
          <Ionicons name="checkmark" size={20} color={theme.primary} />
          <Text style={[typography.body, { color: theme.primary, marginLeft: spacing.xs }]}>
            Saved to your brew history
          </Text>
        </View>
      )}

      <Button
        title="Done"
        variant="secondary"
        onPress={handleDone}
        style={styles.actionButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl + spacing.xxl },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  actionButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  savedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
});
