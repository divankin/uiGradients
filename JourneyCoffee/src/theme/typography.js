import { StyleSheet } from 'react-native';

export const createTypography = (theme) =>
  StyleSheet.create({
    hero: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: -0.5,
    },
    h1: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: -0.3,
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    h3: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    body: {
      fontSize: 15,
      fontWeight: '400',
      color: theme.textSecondary,
      lineHeight: 22,
    },
    bodyLarge: {
      fontSize: 17,
      fontWeight: '400',
      color: theme.textSecondary,
      lineHeight: 26,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.textMuted,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
    },
    buttonLarge: {
      fontSize: 18,
      fontWeight: '700',
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
  });
