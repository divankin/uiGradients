import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, Tag, SectionHeader } from '../components';
import { SEED_BEANS } from '../data/beans';
import { SEED_RECIPES } from '../data/recipes';
import { spacing } from '../theme/spacing';

const UTM_PARAMS = '?utm_source=journey_app&utm_medium=mobile&utm_campaign=bean_detail';

export function BeanDetailScreen({ route, navigation }) {
  const { beanId } = route.params;
  const { theme, typography } = useTheme();

  const bean = useMemo(
    () => SEED_BEANS.find((b) => b.id === beanId),
    [beanId],
  );

  const pairedRecipes = useMemo(
    () => (bean?.recommendedRecipeIds || [])
      .map((id) => SEED_RECIPES.find((r) => r.id === id))
      .filter(Boolean),
    [bean],
  );

  if (!bean) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={typography.h2}>Bean not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.hero}>{bean.title}</Text>
        <Text style={[typography.label, { color: theme.accent, marginTop: spacing.sm }]}>
          {bean.roastLevel} roast
        </Text>
        {bean.priceUsd && (
          <Text style={[typography.h1, { color: theme.primary, marginTop: spacing.sm }]}>
            ${bean.priceUsd.toFixed(2)}
          </Text>
        )}
      </View>

      <Card style={styles.card}>
        <Text style={typography.bodyLarge}>{bean.description}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Flavor Profile
        </Text>
        <View style={styles.tagsRow}>
          {bean.flavorTags.map((tag) => (
            <Tag key={tag} label={tag} selected color={theme.primaryDark} />
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
          Best Brew Methods
        </Text>
        {bean.recommendedMethods.map((method) => (
          <Text key={method} style={[typography.body, { marginBottom: 4 }]}>
            {method === 'pourover' ? 'Pour Over' : method === 'frenchpress' ? 'French Press' : 'AeroPress'}
          </Text>
        ))}
      </Card>

      {pairedRecipes.length > 0 && (
        <>
          <SectionHeader title="Paired Recipes" />
          {pairedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              onPress={() => navigation.navigate('BrewTab', { screen: 'BrewSetup', params: { recipeId: recipe.id } })}
              style={styles.recipeCard}
            >
              <Text style={typography.h3}>{recipe.name}</Text>
              <Text style={[typography.caption, { marginTop: 2 }]}>
                {recipe.difficulty} {recipe.is46Style ? '(4:6)' : ''}
              </Text>
            </Card>
          ))}
        </>
      )}

      <Button
        title="Buy from Journey Coffee Roasters"
        variant="primary"
        size="large"
        onPress={() => Linking.openURL(bean.url + UTM_PARAMS)}
        style={styles.buyButton}
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recipeCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  buyButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
});
