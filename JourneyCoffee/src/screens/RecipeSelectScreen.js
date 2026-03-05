import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card, Tag } from '../components';
import { SEED_RECIPES } from '../data/recipes';
import { spacing } from '../theme/spacing';
import { formatTime } from '../utils/units';

export function RecipeSelectScreen({ route, navigation }) {
  const { method } = route.params;
  const { theme, typography } = useTheme();

  const recipes = useMemo(
    () => SEED_RECIPES.filter((r) => r.method === method),
    [method],
  );

  const methodLabels = {
    pourover: 'Pour Over',
    frenchpress: 'French Press',
    aeropress: 'AeroPress',
  };

  const handleSelect = (recipe) => {
    navigation.navigate('BrewSetup', { recipeId: recipe.id });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.h1}>{methodLabels[method]} Recipes</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Pick a recipe to get started.
        </Text>
      </View>

      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          onPress={() => handleSelect(recipe)}
          style={styles.recipeCard}
        >
          <View style={styles.cardHeader}>
            <Text style={typography.h3}>{recipe.name}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: theme.inputBackground }]}>
              <Text style={[typography.caption, { color: theme.textSecondary }]}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>
          <Text style={[typography.body, { marginTop: spacing.xs }]}>
            {recipe.description}
          </Text>
          <View style={styles.tagsRow}>
            {recipe.flavorGoalTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
          <View style={styles.metaRow}>
            <Text style={typography.caption}>
              {recipe.defaultCoffeeAmount}g coffee
            </Text>
            <Text style={[typography.caption, { marginLeft: spacing.md }]}>
              1:{recipe.defaultRatio} ratio
            </Text>
            <Text style={[typography.caption, { marginLeft: spacing.md }]}>
              {formatTime(recipe.totalTimeTargetSec)}
            </Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  recipeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
});
