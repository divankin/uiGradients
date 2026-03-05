/**
 * Async storage wrapper for offline persistence.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_SETTINGS: '@journey_settings',
  QUIZ_PROFILE: '@journey_quiz',
  BREW_HISTORY: '@journey_brew_history',
  FAVORITE_RECIPES: '@journey_favorite_recipes',
  FAVORITE_BEANS: '@journey_favorite_beans',
  BEAN_CATALOG: '@journey_bean_catalog',
};

async function getJSON(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently for storage errors
  }
}

// User Settings
export async function loadSettings() {
  return getJSON(KEYS.USER_SETTINGS);
}

export async function saveSettings(settings) {
  return setJSON(KEYS.USER_SETTINGS, settings);
}

// Quiz Profile
export async function loadQuizProfile() {
  return getJSON(KEYS.QUIZ_PROFILE);
}

export async function saveQuizProfile(profile) {
  return setJSON(KEYS.QUIZ_PROFILE, profile);
}

// Brew History
export async function loadBrewHistory() {
  return (await getJSON(KEYS.BREW_HISTORY)) || [];
}

export async function saveBrewSession(session) {
  const history = await loadBrewHistory();
  history.unshift(session);
  return setJSON(KEYS.BREW_HISTORY, history);
}

// Favorite Recipes
export async function loadFavoriteRecipes() {
  return (await getJSON(KEYS.FAVORITE_RECIPES)) || [];
}

export async function toggleFavoriteRecipe(recipeId) {
  const favorites = await loadFavoriteRecipes();
  const index = favorites.indexOf(recipeId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(recipeId);
  }
  await setJSON(KEYS.FAVORITE_RECIPES, favorites);
  return favorites;
}

// Favorite Beans
export async function loadFavoriteBeans() {
  return (await getJSON(KEYS.FAVORITE_BEANS)) || [];
}

export async function toggleFavoriteBean(beanId) {
  const favorites = await loadFavoriteBeans();
  const index = favorites.indexOf(beanId);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(beanId);
  }
  await setJSON(KEYS.FAVORITE_BEANS, favorites);
  return favorites;
}

// Bean Catalog (synced from website)
export async function loadBeanCatalog() {
  return getJSON(KEYS.BEAN_CATALOG);
}

export async function saveBeanCatalog(beans) {
  return setJSON(KEYS.BEAN_CATALOG, beans);
}
