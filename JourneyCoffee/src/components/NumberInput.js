import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing, touchTargets } from '../theme/spacing';

export function NumberInput({ label, value, unit, onIncrement, onDecrement, step = 1 }) {
  const { theme, typography } = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={[typography.caption, styles.label]}>{label}</Text>}
      <View style={[styles.row, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder }]}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[styles.button, { borderRightColor: theme.inputBorder }]}
          activeOpacity={0.6}
        >
          <Text style={[typography.h2, { color: theme.primary }]}>-</Text>
        </TouchableOpacity>
        <View style={styles.valueContainer}>
          <Text style={[typography.h3, { color: theme.textPrimary }]}>
            {value}{unit ? ` ${unit}` : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onIncrement}
          style={[styles.button, { borderLeftColor: theme.inputBorder }]}
          activeOpacity={0.6}
        >
          <Text style={[typography.h2, { color: theme.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    height: touchTargets.comfortable,
  },
  button: {
    width: touchTargets.comfortable,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
