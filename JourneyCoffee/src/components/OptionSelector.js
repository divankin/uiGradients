import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, spacing, touchTargets } from '../theme/spacing';

export function OptionSelector({ options, selectedValue, onSelect, label, multiSelect = false }) {
  const { theme, typography } = useTheme();

  const isSelected = (value) => {
    if (multiSelect && Array.isArray(selectedValue)) {
      return selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  const handlePress = (value) => {
    if (multiSelect) {
      const current = Array.isArray(selectedValue) ? selectedValue : [];
      if (current.includes(value)) {
        onSelect(current.filter((v) => v !== value));
      } else {
        onSelect([...current, value]);
      }
    } else {
      onSelect(value);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[typography.label, { marginBottom: spacing.sm }]}>{label}</Text>}
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const active = isSelected(option.value || option.id);
          return (
            <TouchableOpacity
              key={option.value || option.id}
              onPress={() => handlePress(option.value || option.id)}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  backgroundColor: active ? theme.primary : theme.inputBackground,
                  borderColor: active ? theme.primary : theme.inputBorder,
                },
              ]}
            >
              <Text
                style={[
                  typography.body,
                  {
                    color: active ? theme.textOnPrimary : theme.textPrimary,
                    fontWeight: active ? '600' : '400',
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {option.description && (
                <Text
                  style={[
                    typography.caption,
                    {
                      color: active ? theme.textOnPrimary : theme.textMuted,
                      textAlign: 'center',
                      marginTop: 2,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {option.description}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minWidth: 90,
    minHeight: touchTargets.comfortable,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
