import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Card, OptionSelector, SectionHeader, Button } from '../components';
import { BREW_METHODS, ROAST_LEVELS } from '../models';
import { spacing } from '../theme/spacing';

function SettingRow({ label, children, theme, typography }) {
  return (
    <View style={styles.settingRow}>
      <Text style={[typography.body, { flex: 1, color: theme.textPrimary }]}>{label}</Text>
      {children}
    </View>
  );
}

export function SettingsScreen() {
  const { theme, typography, themeMode, setThemeMode } = useTheme();
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    updateSettings({ themeMode: mode });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.hero}>Settings</Text>
      </View>

      {/* Units */}
      <SectionHeader title="Units" />
      <Card style={styles.card}>
        <OptionSelector
          options={[
            { value: 'imperial', label: 'Imperial', description: '\u00B0F, oz' },
            { value: 'metric', label: 'Metric', description: '\u00B0C, grams' },
          ]}
          selectedValue={settings.unitSystem}
          onSelect={(v) => updateSettings({ unitSystem: v })}
        />
      </Card>

      {/* Theme */}
      <SectionHeader title="Appearance" />
      <Card style={styles.card}>
        <OptionSelector
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
          selectedValue={themeMode}
          onSelect={handleThemeChange}
        />
      </Card>

      {/* Sound & Vibration */}
      <SectionHeader title="Brew Feedback" />
      <Card style={styles.card}>
        <SettingRow label="Sound cues" theme={theme} typography={typography}>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(v) => updateSettings({ soundEnabled: v })}
            trackColor={{ true: theme.primary, false: theme.inputBorder }}
            thumbColor={theme.surface}
          />
        </SettingRow>
        <SettingRow label="Vibration cues" theme={theme} typography={typography}>
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={(v) => updateSettings({ vibrationEnabled: v })}
            trackColor={{ true: theme.primary, false: theme.inputBorder }}
            thumbColor={theme.surface}
          />
        </SettingRow>
        <SettingRow label="Timer on by default" theme={theme} typography={typography}>
          <Switch
            value={settings.timerEnabledByDefault}
            onValueChange={(v) => updateSettings({ timerEnabledByDefault: v })}
            trackColor={{ true: theme.primary, false: theme.inputBorder }}
            thumbColor={theme.surface}
          />
        </SettingRow>
      </Card>

      {/* Preferred Method */}
      <SectionHeader title="Preferred Brew Method" />
      <Card style={styles.card}>
        <OptionSelector
          options={BREW_METHODS.map((m) => ({ value: m.id, label: m.label }))}
          selectedValue={settings.preferredMethod}
          onSelect={(v) => updateSettings({ preferredMethod: v })}
        />
      </Card>

      {/* Default Ratios */}
      <SectionHeader title="Default Ratios" subtitle="Customize your starting ratio for each method." />
      <Card style={styles.card}>
        {BREW_METHODS.map((m) => (
          <SettingRow key={m.id} label={m.label} theme={theme} typography={typography}>
            <View style={styles.ratioRow}>
              <Ionicons
                name="remove-circle-outline"
                size={28}
                color={theme.primary}
                onPress={() => {
                  const current = settings.defaultRatiosByMethod[m.id] || 15;
                  updateSettings({
                    defaultRatiosByMethod: {
                      ...settings.defaultRatiosByMethod,
                      [m.id]: Math.max(10, current - 1),
                    },
                  });
                }}
              />
              <Text style={[typography.h3, { marginHorizontal: spacing.sm }]}>
                1:{settings.defaultRatiosByMethod[m.id] || 15}
              </Text>
              <Ionicons
                name="add-circle-outline"
                size={28}
                color={theme.primary}
                onPress={() => {
                  const current = settings.defaultRatiosByMethod[m.id] || 15;
                  updateSettings({
                    defaultRatiosByMethod: {
                      ...settings.defaultRatiosByMethod,
                      [m.id]: Math.min(20, current + 1),
                    },
                  });
                }}
              />
            </View>
          </SettingRow>
        ))}
      </Card>

      {/* Links */}
      <SectionHeader title="Journey Coffee Roasters" />
      <Card style={styles.card}>
        <Button
          title="Visit Our Website"
          variant="outline"
          size="medium"
          onPress={() =>
            Linking.openURL(
              'https://www.journeyroasters.com?utm_source=journey_app&utm_medium=mobile&utm_campaign=settings',
            )
          }
          style={{ marginBottom: spacing.sm }}
        />
      </Card>

      {/* About */}
      <SectionHeader title="About" />
      <Card style={styles.card}>
        <Text style={typography.h3}>Journey Brewing Companion</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          by Journey Coffee Roasters
        </Text>
        <Text style={[typography.caption, { marginTop: spacing.sm }]}>
          Version 1.0.0
        </Text>
        <Text style={[typography.body, { marginTop: spacing.md }]}>
          Crafted with care to help you brew better coffee and enjoy every cup.
          We believe great coffee starts with great beans and a thoughtful approach
          to brewing.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxl + spacing.xxl },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  card: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
