/**
 * Recommendation engine.
 *
 * Uses quiz answers, brew history, and ratings to recommend beans,
 * recipes, and recipe adjustments.
 */

/**
 * Score a bean against quiz preferences. Higher = better match.
 */
export function scoreBeanForProfile(bean, quizProfile) {
  if (!quizProfile) return 0;
  let score = 0;

  // Flavor tag overlap
  const preferredFlavors = quizProfile.flavorPreferences || [];
  for (const tag of bean.flavorTags) {
    if (preferredFlavors.includes(tag)) score += 3;
  }

  // Method match
  const favMethods = quizProfile.favoriteMethods || [];
  for (const method of bean.recommendedMethods) {
    if (favMethods.includes(method)) score += 2;
  }

  // Roast level preferences based on flavor direction
  if (quizProfile.preferredFlavorDirection === 'bright') {
    if (bean.roastLevel === 'light' || bean.roastLevel === 'medium-light') score += 2;
  } else if (quizProfile.preferredFlavorDirection === 'rich') {
    if (bean.roastLevel === 'medium-dark' || bean.roastLevel === 'dark') score += 2;
  } else {
    if (bean.roastLevel === 'medium') score += 2;
  }

  // Body preference
  if (quizProfile.bodyPreference === 'heavy') {
    if (bean.roastLevel === 'dark' || bean.roastLevel === 'medium-dark') score += 1;
  } else if (quizProfile.bodyPreference === 'light') {
    if (bean.roastLevel === 'light' || bean.roastLevel === 'medium-light') score += 1;
  }

  return score;
}

/**
 * Rank beans by profile match.
 */
export function recommendBeans(beans, quizProfile) {
  if (!quizProfile) return beans;
  return [...beans]
    .map((bean) => ({ bean, score: scoreBeanForProfile(bean, quizProfile) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.bean);
}

/**
 * Score a recipe against quiz preferences.
 */
export function scoreRecipeForProfile(recipe, quizProfile) {
  if (!quizProfile) return 0;
  let score = 0;

  const favMethods = quizProfile.favoriteMethods || [];
  if (favMethods.includes(recipe.method)) score += 3;

  const preferredFlavors = quizProfile.flavorPreferences || [];
  for (const tag of recipe.flavorGoalTags) {
    if (preferredFlavors.includes(tag)) score += 2;
  }

  if (quizProfile.strengthPreference === 'strong' && recipe.defaultRatio <= 14) score += 1;
  if (quizProfile.strengthPreference === 'delicate' && recipe.defaultRatio >= 16) score += 1;

  return score;
}

/**
 * Rank recipes by profile match.
 */
export function recommendRecipes(recipes, quizProfile) {
  if (!quizProfile) return recipes;
  return [...recipes]
    .map((recipe) => ({ recipe, score: scoreRecipeForProfile(recipe, quizProfile) }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.recipe);
}

/**
 * Generate recipe adjustment notes from quiz profile.
 */
export function generateAdjustmentNotes(quizProfile) {
  if (!quizProfile) return [];
  const notes = [];

  if (quizProfile.preferredFlavorDirection === 'bright') {
    notes.push('Try a slightly coarser grind to let bright, fruity notes come through.');
    notes.push('Consider slightly hotter water to enhance clarity.');
  } else if (quizProfile.preferredFlavorDirection === 'rich') {
    notes.push('A slightly finer grind can bring out more body and richness.');
    notes.push('Slightly cooler water can help reduce harshness with darker roasts.');
  }

  if (quizProfile.bodyPreference === 'heavy') {
    notes.push('Lower ratios (1:13 to 1:14) will produce a heavier, more concentrated cup.');
  } else if (quizProfile.bodyPreference === 'light') {
    notes.push('Higher ratios (1:16 to 1:17) will give a lighter, more tea-like cup.');
  }

  if (quizProfile.strengthPreference === 'strong') {
    notes.push('Increase your dose or decrease your ratio for a stronger cup.');
  } else if (quizProfile.strengthPreference === 'delicate') {
    notes.push('A higher ratio and coarser grind will produce a more delicate, gentle cup.');
  }

  if (quizProfile.acidityPreference === 'high') {
    notes.push('Light roast beans with a clarity-focused pour structure will highlight acidity.');
  } else if (quizProfile.acidityPreference === 'low') {
    notes.push('Medium to dark roasts with a sweetness-focused pour structure will soften acidity.');
  }

  return notes;
}

/**
 * Generate brew adjustment suggestions from a completed brew session.
 */
export function suggestBrewAdjustments(session) {
  const suggestions = [];

  if (session.outcome === 'too-sour') {
    suggestions.push('Try grinding finer to increase extraction.');
    suggestions.push('You could also use slightly hotter water.');
    suggestions.push('Consider extending your brew time slightly.');
  } else if (session.outcome === 'too-bitter') {
    suggestions.push('Try grinding coarser to reduce over-extraction.');
    suggestions.push('Slightly cooler water may help.');
    suggestions.push('Consider shortening your brew time.');
  }

  if (session.tasteTags?.includes('thin')) {
    suggestions.push('Try reducing your water amount or using a lower ratio for more body.');
  }
  if (session.tasteTags?.includes('heavy')) {
    suggestions.push('Increase your ratio slightly for a lighter, cleaner cup.');
  }

  if (session.outcome === 'just-right' && suggestions.length === 0) {
    suggestions.push('Great brew! Consider saving this recipe to your favorites.');
  }

  return suggestions;
}
