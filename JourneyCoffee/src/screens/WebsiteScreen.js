import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card, Button } from '../components';
import { spacing } from '../theme/spacing';

const BASE_URL = 'https://www.journeycoffeeroasters.com';
const UTM = '?utm_source=journey_app&utm_medium=mobile&utm_campaign=website_section';

const LINKS = [
  { label: 'Shop All Coffee', path: '/collections/coffee', icon: 'bag-outline' },
  { label: 'New Arrivals', path: '/collections/new', icon: 'sparkles-outline' },
  { label: 'Subscriptions', path: '/pages/subscriptions', icon: 'repeat-outline' },
  { label: 'Brewing Equipment', path: '/collections/equipment', icon: 'construct-outline' },
  { label: 'Our Story', path: '/pages/about', icon: 'heart-outline' },
  { label: 'Contact Us', path: '/pages/contact', icon: 'mail-outline' },
];

export function WebsiteScreen() {
  const { theme, typography } = useTheme();

  const openLink = (path) => {
    Linking.openURL(BASE_URL + path + UTM);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={typography.hero}>Journey Coffee</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Visit our website to explore, shop, and learn more about what we do.
        </Text>
      </View>

      <View style={styles.links}>
        {LINKS.map((link) => (
          <Card
            key={link.path}
            onPress={() => openLink(link.path)}
            style={styles.linkCard}
          >
            <View style={styles.linkRow}>
              <Ionicons name={link.icon} size={24} color={theme.primary} />
              <Text style={[typography.h3, { marginLeft: spacing.md, flex: 1 }]}>
                {link.label}
              </Text>
              <Ionicons name="open-outline" size={18} color={theme.textMuted} />
            </View>
          </Card>
        ))}
      </View>

      <Button
        title="Open Full Website"
        variant="primary"
        size="large"
        onPress={() => openLink('')}
        style={styles.fullButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  links: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  linkCard: {
    padding: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
});
