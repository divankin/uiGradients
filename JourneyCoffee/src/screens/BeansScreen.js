import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card, Tag, Button, SectionHeader } from '../components';
import { SEED_BEANS } from '../data/beans';
import { ROAST_LEVELS } from '../models';
import { loadBeanCatalog } from '../utils/storage';
import { spacing } from '../theme/spacing';

const UTM_PARAMS = '?utm_source=journey_app&utm_medium=mobile&utm_campaign=bean_browse';

export function BeansScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const [roastFilter, setRoastFilter] = useState(null);
  const [beans, setBeans] = useState(SEED_BEANS);

  // Load synced beans if available
  useEffect(() => {
    loadBeanCatalog().then((synced) => {
      if (synced && synced.length > 0) setBeans(synced);
    });
  }, []);

  const filteredBeans = useMemo(
    () =>
      roastFilter
        ? beans.filter((b) => b.roastLevel === roastFilter)
        : beans,
    [beans, roastFilter],
  );

  const handleOpenProduct = (bean) => {
    const url = bean.url + UTM_PARAMS;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.hero}>Beans</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Discover and shop Journey Coffee Roasters beans. Find your perfect match.
        </Text>
      </View>

      {/* Roast filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        <Tag label="All" selected={!roastFilter} onPress={() => setRoastFilter(null)} />
        {ROAST_LEVELS.map((r) => (
          <Tag
            key={r.id}
            label={r.label}
            selected={roastFilter === r.id}
            onPress={() => setRoastFilter(r.id)}
          />
        ))}
      </ScrollView>

      {/* Bean cards */}
      {filteredBeans.map((bean) => (
        <Card key={bean.id} style={styles.beanCard}>
          <View style={styles.beanHeader}>
            <View style={{ flex: 1 }}>
              <Text style={typography.h2}>{bean.title}</Text>
              <Text style={[typography.caption, { marginTop: 2 }]}>
                {bean.roastLevel} roast
              </Text>
            </View>
            {bean.priceUsd && (
              <Text style={[typography.h3, { color: theme.primary }]}>
                ${bean.priceUsd.toFixed(2)}
              </Text>
            )}
          </View>
          <Text style={[typography.body, { marginTop: spacing.sm }]}>
            {bean.description}
          </Text>
          <View style={[styles.tagsRow, { marginTop: spacing.sm }]}>
            {bean.flavorTags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
          <View style={styles.beanMeta}>
            <Text style={typography.caption}>
              Best for: {bean.recommendedMethods.map((m) =>
                m === 'pourover' ? 'Pour Over' : m === 'frenchpress' ? 'French Press' : 'AeroPress'
              ).join(', ')}
            </Text>
          </View>
          <View style={styles.beanActions}>
            <Button
              title="View Details"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('BeanDetail', { beanId: bean.id })}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Shop"
              variant="primary"
              size="small"
              onPress={() => handleOpenProduct(bean)}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ))}

      {/* Shop CTA */}
      <Card
        onPress={() => Linking.openURL('https://www.journeycoffeeroasters.com' + UTM_PARAMS)}
        style={[styles.ctaCard, { backgroundColor: theme.primary }]}
      >
        <Ionicons name="globe-outline" size={28} color={theme.textOnPrimary} />
        <Text style={[typography.h3, { color: theme.textOnPrimary, marginTop: spacing.sm }]}>
          Visit Journey Coffee Roasters
        </Text>
        <Text style={[typography.body, { color: theme.textOnPrimary, opacity: 0.9, marginTop: spacing.xs }]}>
          Browse the full collection on our website.
        </Text>
      </Card>
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
    paddingVertical: spacing.sm,
  },
  beanCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  beanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  beanMeta: {
    marginTop: spacing.sm,
  },
  beanActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  ctaCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
});
