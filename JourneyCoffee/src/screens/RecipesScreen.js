import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card, Tag, OptionSelector, SectionHeader, Button } from '../components';
import { SEED_RECIPES } from '../data/recipes';
import { BREW_METHODS, DIFFICULTY_LEVELS, FLAVOR_GOAL_TAGS } from '../models';
import { formatTime } from '../utils/units';
import { spacing } from '../theme/spacing';

export function RecipesScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const [methodFilter, setMethodFilter] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);
  const [flavorFilter, setFlavorFilter] = useState(null);

  const filteredRecipes = useMemo(() => {
    return SEED_RECIPES.filter((r) => {
      if (methodFilter && r.method !== methodFilter) return false;
      if (difficultyFilter && r.difficulty !== difficultyFilter) return false;
      if (flavorFilter && !r.flavorGoalTags.includes(flavorFilter)) return false;
      return true;
    });
  }, [methodFilter, difficultyFilter, flavorFilter]);

  const clearFilters = () => {
    setMethodFilter(null);
    setDifficultyFilter(null);
    setFlavorFilter(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.hero}>Recipes</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Browse recipes by method, difficulty, or flavor goal.
        </Text>
      </View>

      {/* Filters */}
      <SectionHeader title="Brew Method" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Tag label="All" selected={!methodFilter} onPress={() => setMethodFilter(null)} />
        {BREW_METHODS.map((m) => (
          <Tag
            key={m.id}
            label={m.label}
            selected={methodFilter === m.id}
            onPress={() => setMethodFilter(m.id)}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Difficulty" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Tag label="All" selected={!difficultyFilter} onPress={() => setDifficultyFilter(null)} />
        {DIFFICULTY_LEVELS.map((d) => (
          <Tag
            key={d.id}
            label={d.label}
            selected={difficultyFilter === d.id}
            onPress={() => setDifficultyFilter(d.id)}
          />
        ))}
      </ScrollView>

      <SectionHeader title="Flavor Goal" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Tag label="All" selected={!flavorFilter} onPress={() => setFlavorFilter(null)} />
        {FLAVOR_GOAL_TAGS.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            selected={flavorFilter === tag}
            onPress={() => setFlavorFilter(tag)}
          />
        ))}
      </ScrollView>

      {(methodFilter || difficultyFilter || flavorFilter) && (
        <Button
          title="Clear Filters"
          variant="ghost"
          size="small"
          onPress={clearFilters}
          style={{ marginHorizontal: spacing.md, marginTop: spacing.sm }}
        />
      )}

      {/* Results */}
      <View style={styles.results}>
        <Text style={[typography.caption, { marginBottom: spacing.sm, paddingHorizontal: spacing.md }]}>
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </Text>
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
            style={styles.recipeCard}
          >
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={typography.h3}>{recipe.name}</Text>
                <Text style={[typography.caption, { marginTop: 2 }]}>
                  {recipe.method === 'pourover' ? 'Pour Over' : recipe.method === 'frenchpress' ? 'French Press' : 'AeroPress'}
                  {' \u00B7 '}{recipe.difficulty}
                  {recipe.is46Style ? ' \u00B7 4:6 method' : ''}
                </Text>
              </View>
              <Text style={[typography.h3, { color: theme.primary }]}>
                {formatTime(recipe.totalTimeTargetSec)}
              </Text>
            </View>
            <Text
              style={[typography.body, { marginTop: spacing.xs }]}
              numberOfLines={2}
            >
              {recipe.description}
            </Text>
            <View style={[styles.tagsRow, { marginTop: spacing.sm }]}>
              {recipe.flavorGoalTags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  results: {
    marginTop: spacing.md,
  },
  recipeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
