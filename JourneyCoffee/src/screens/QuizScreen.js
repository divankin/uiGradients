import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, OptionSelector, Tag } from '../components';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { SEED_BEANS } from '../data/beans';
import { SEED_RECIPES } from '../data/recipes';
import {
  recommendBeans,
  recommendRecipes,
  generateAdjustmentNotes,
} from '../utils/recommendations';
import { saveQuizProfile } from '../utils/storage';
import { spacing } from '../theme/spacing';

export function QuizScreen({ navigation }) {
  const { theme, typography } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const isLast = currentQuestion === QUIZ_QUESTIONS.length - 1;
  const isFirst = currentQuestion === 0;

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [question.field]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentQuestion((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setCurrentQuestion((i) => i - 1);
  };

  const finishQuiz = useCallback(async () => {
    const profile = {
      preferredFlavorDirection: answers.preferredFlavorDirection || 'balanced',
      bodyPreference: answers.bodyPreference || 'medium',
      acidityPreference: answers.acidityPreference || 'medium',
      strengthPreference: answers.strengthPreference || 'moderate',
      flavorPreferences: answers.flavorPreferences || [],
      favoriteMethods: answers.favoriteMethods || [],
      recommendedBeanIds: [],
      recommendedAdjustmentNotes: [],
    };

    // Generate recommendations
    const rankedBeans = recommendBeans(SEED_BEANS, profile);
    profile.recommendedBeanIds = rankedBeans.slice(0, 3).map((b) => b.id);
    profile.recommendedAdjustmentNotes = generateAdjustmentNotes(profile);

    await saveQuizProfile(profile);
    setShowResults(true);
  }, [answers]);

  // Results
  const profile = useMemo(() => {
    if (!showResults) return null;
    return {
      preferredFlavorDirection: answers.preferredFlavorDirection || 'balanced',
      bodyPreference: answers.bodyPreference || 'medium',
      acidityPreference: answers.acidityPreference || 'medium',
      strengthPreference: answers.strengthPreference || 'moderate',
      flavorPreferences: answers.flavorPreferences || [],
      favoriteMethods: answers.favoriteMethods || [],
    };
  }, [showResults, answers]);

  const recommendedBeans = useMemo(
    () => (profile ? recommendBeans(SEED_BEANS, profile).slice(0, 3) : []),
    [profile],
  );

  const recommendedRecipesList = useMemo(
    () => (profile ? recommendRecipes(SEED_RECIPES, profile).slice(0, 3) : []),
    [profile],
  );

  const adjustmentNotes = useMemo(
    () => (profile ? generateAdjustmentNotes(profile) : []),
    [profile],
  );

  if (showResults) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Ionicons name="sparkles" size={40} color={theme.primary} />
          <Text style={[typography.hero, { marginTop: spacing.sm }]}>Your Coffee Profile</Text>
          <Text style={[typography.body, { marginTop: spacing.xs }]}>
            Based on your preferences, here are our recommendations.
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
            Recommended Beans
          </Text>
          {recommendedBeans.map((bean) => (
            <View key={bean.id} style={styles.recItem}>
              <Text style={typography.h3}>{bean.title}</Text>
              <Text style={typography.caption}>{bean.roastLevel} roast</Text>
              <View style={[styles.tagsRow, { marginTop: 4 }]}>
                {bean.flavorTags.slice(0, 3).map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </View>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={[typography.label, { color: theme.primary, marginBottom: spacing.sm }]}>
            Recommended Recipes
          </Text>
          {recommendedRecipesList.map((recipe) => (
            <View key={recipe.id} style={styles.recItem}>
              <Text style={typography.h3}>{recipe.name}</Text>
              <Text style={typography.caption}>
                {recipe.method === 'pourover' ? 'Pour Over' : recipe.method === 'frenchpress' ? 'French Press' : 'AeroPress'}
              </Text>
            </View>
          ))}
        </Card>

        {adjustmentNotes.length > 0 && (
          <Card style={styles.card}>
            <Text style={[typography.label, { color: theme.accent, marginBottom: spacing.sm }]}>
              Brewing Tips for You
            </Text>
            {adjustmentNotes.map((note, i) => (
              <View key={i} style={styles.noteRow}>
                <Ionicons name="bulb-outline" size={16} color={theme.accent} />
                <Text style={[typography.body, { marginLeft: spacing.sm, flex: 1 }]}>
                  {note}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <Button
          title="Retake Quiz"
          variant="outline"
          onPress={() => {
            setShowResults(false);
            setCurrentQuestion(0);
            setAnswers({});
          }}
          style={styles.actionButton}
        />
        <Button
          title="Browse Beans"
          variant="primary"
          onPress={() => navigation.navigate('BeansTab')}
          style={styles.actionButton}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={typography.h1}>Taste Preferences</Text>
        <Text style={[typography.body, { marginTop: spacing.xs }]}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={[styles.progressBar, { backgroundColor: theme.inputBackground }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.primary,
              width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
            },
          ]}
        />
      </View>

      <Card style={styles.questionCard}>
        <Text style={[typography.h2, { marginBottom: spacing.lg }]}>{question.question}</Text>
        <OptionSelector
          options={question.options}
          selectedValue={answers[question.field]}
          onSelect={handleAnswer}
          multiSelect={question.multiSelect}
        />
      </Card>

      <View style={styles.navRow}>
        <Button
          title="Back"
          variant="ghost"
          size="medium"
          onPress={handleBack}
          disabled={isFirst}
          style={{ flex: 1, marginRight: spacing.sm }}
        />
        <Button
          title={isLast ? 'See Results' : 'Next'}
          variant="primary"
          size="medium"
          onPress={handleNext}
          disabled={!answers[question.field]}
          style={{ flex: 2 }}
        />
      </View>
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
  progressBar: {
    height: 4,
    marginHorizontal: spacing.md,
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  questionCard: {
    marginHorizontal: spacing.md,
    padding: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  recItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  actionButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
});
