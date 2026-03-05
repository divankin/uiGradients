import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card, Button } from '../components';
import { BREW_METHODS } from '../models';
import { spacing, borderRadius, touchTargets } from '../theme/spacing';
import { useBrew } from '../context/BrewContext';

export function BrewScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const { brewState } = useBrew();

  const handleSelectMethod = (methodId) => {
    navigation.navigate('RecipeSelect', { method: methodId });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.hero}>Brew</Text>
        <Text style={[typography.bodyLarge, { marginTop: spacing.xs }]}>
          Choose your method and start brewing.
        </Text>
      </View>

      {brewState.isActive && (
        <Card
          onPress={() => navigation.navigate('BrewSession')}
          style={[styles.activeBrewCard, { borderColor: theme.primary }]}
        >
          <View style={styles.activeBrewRow}>
            <Ionicons name="timer-outline" size={24} color={theme.primary} />
            <View style={{ marginLeft: spacing.sm, flex: 1 }}>
              <Text style={[typography.h3, { color: theme.primary }]}>Brew in Progress</Text>
              <Text style={typography.body}>{brewState.recipe?.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </View>
        </Card>
      )}

      <View style={styles.methods}>
        {BREW_METHODS.map((method) => (
          <Card
            key={method.id}
            onPress={() => handleSelectMethod(method.id)}
            style={styles.methodCard}
          >
            <Ionicons
              name={method.icon}
              size={36}
              color={theme.primary}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={typography.h2}>{method.label}</Text>
            <Text style={[typography.caption, { marginTop: spacing.xs }]}>
              {method.id === 'pourover' && 'Pour over, drip, 4:6 method'}
              {method.id === 'frenchpress' && 'Full immersion, rich body'}
              {method.id === 'aeropress' && 'Versatile, portable, clean'}
            </Text>
          </Card>
        ))}
      </View>

      <Button
        title="Quick Brew"
        variant="outline"
        onPress={() => handleSelectMethod('pourover')}
        style={{ marginHorizontal: spacing.md, marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  activeBrewCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  activeBrewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methods: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  methodCard: {
    padding: spacing.lg,
  },
});
