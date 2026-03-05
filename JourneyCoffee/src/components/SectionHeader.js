import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';

export function SectionHeader({ title, subtitle }) {
  const { theme, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[typography.label, { color: theme.primary }]}>{title}</Text>
      {subtitle && (
        <Text style={[typography.body, { marginTop: spacing.xs }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
