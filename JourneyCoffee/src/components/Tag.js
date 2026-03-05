import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing } from '../theme/spacing';

export function Tag({ label, selected = false, onPress, color }) {
  const { theme, typography } = useTheme();

  const bg = selected
    ? color || theme.primary
    : theme.inputBackground;
  const textColor = selected
    ? theme.textOnPrimary
    : theme.textSecondary;

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tag, { backgroundColor: bg }]}
    >
      <Text style={[typography.caption, { color: textColor, fontWeight: '600' }]}>
        {label}
      </Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});
