import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { borderRadius, touchTargets, spacing } from '../theme/spacing';

export function Button({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size = 'large', // 'large' | 'medium' | 'small'
  disabled = false,
  loading = false,
  style,
}) {
  const { theme, typography } = useTheme();

  const bgColor = {
    primary: theme.primary,
    secondary: theme.surface,
    accent: theme.accent,
    outline: 'transparent',
    ghost: 'transparent',
  };

  const textColor = {
    primary: theme.textOnPrimary,
    secondary: theme.textPrimary,
    accent: theme.textOnAccent,
    outline: theme.primary,
    ghost: theme.textSecondary,
  };

  const borderColor = variant === 'outline' ? theme.primary : 'transparent';

  const heights = {
    large: touchTargets.large,
    medium: touchTargets.comfortable,
    small: touchTargets.minimum,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: disabled ? theme.divider : bgColor[variant],
          borderColor: disabled ? theme.divider : borderColor,
          height: heights[size],
          paddingHorizontal: size === 'small' ? spacing.md : spacing.lg,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <Text
          style={[
            size === 'large' ? typography.buttonLarge : typography.button,
            { color: disabled ? theme.textMuted : textColor[variant] },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
