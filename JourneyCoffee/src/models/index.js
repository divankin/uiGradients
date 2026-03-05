/**
 * Data model type definitions for Journey Brewing Companion.
 *
 * These are documented as JSDoc for runtime reference. Each model describes
 * the shape used throughout the app.
 */

/**
 * @typedef {'imperial' | 'metric'} UnitSystem
 * @typedef {'light' | 'dark' | 'system'} ThemeMode
 * @typedef {'pourover' | 'frenchpress' | 'aeropress'} BrewMethod
 * @typedef {'extra-fine' | 'fine' | 'medium-fine' | 'medium' | 'medium-coarse' | 'coarse'} GrindSize
 * @typedef {'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'} RoastLevel
 * @typedef {'easy' | 'standard' | 'nerdy'} Difficulty
 */

/**
 * @typedef {Object} UserSettings
 * @property {UnitSystem} unitSystem
 * @property {ThemeMode} themeMode
 * @property {boolean} soundEnabled
 * @property {boolean} vibrationEnabled
 * @property {boolean} timerEnabledByDefault
 * @property {BrewMethod} preferredMethod
 * @property {Object<BrewMethod, number>} defaultRatiosByMethod
 */

/**
 * @typedef {Object} RecipeStep
 * @property {number} order
 * @property {string} title
 * @property {string} instruction
 * @property {number} waterAddAmount - grams of water to add in this step
 * @property {number} cumulativeWaterTarget - total water after this step
 * @property {number|null} timerDurationSec - seconds for this step (null if untimed)
 * @property {boolean} isBloomStep
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {BrewMethod} method
 * @property {string} name
 * @property {string} description
 * @property {Difficulty} difficulty
 * @property {string[]} flavorGoalTags
 * @property {number} defaultCoffeeAmount - grams
 * @property {number} defaultWaterAmount - grams
 * @property {number} defaultRatio - water:coffee (e.g. 15 means 1:15)
 * @property {RoastLevel[]} suggestedRoastLevels
 * @property {GrindSize} grindRecommendation
 * @property {string} grindGuidanceText
 * @property {boolean} timerRecommended
 * @property {number} totalTimeTargetSec
 * @property {string[]} suggestedBeanIds
 * @property {RecipeStep[]} steps
 * @property {boolean} is46Style - whether this uses 4:6 pour structure
 * @property {string|null} flavorBias - e.g. 'sweetness' or 'clarity' for 4:6
 */

/**
 * @typedef {Object} Bean
 * @property {string} id
 * @property {string} title
 * @property {string} url
 * @property {string} description
 * @property {RoastLevel} roastLevel
 * @property {string[]} flavorTags
 * @property {BrewMethod[]} recommendedMethods
 * @property {string[]} recommendedRecipeIds
 * @property {string|null} imageUrl
 * @property {number|null} priceUsd
 */

/**
 * @typedef {Object} BrewSession
 * @property {string} id
 * @property {string} recipeId
 * @property {string|null} beanId
 * @property {string} dateTime - ISO string
 * @property {number} coffeeAmount
 * @property {number} waterAmount
 * @property {number} ratio
 * @property {RoastLevel} roastLevel
 * @property {GrindSize} grindSize
 * @property {number} tempCelsius
 * @property {UnitSystem} unitSystem
 * @property {boolean} timerModeUsed
 * @property {number|null} rating - 1 to 5
 * @property {string|null} outcome - 'too-sour' | 'too-bitter' | 'just-right'
 * @property {string[]} tasteTags
 */

/**
 * @typedef {Object} QuizProfile
 * @property {string} preferredFlavorDirection - 'bright' | 'rich' | 'balanced'
 * @property {string} bodyPreference - 'light' | 'medium' | 'heavy'
 * @property {string} acidityPreference - 'low' | 'medium' | 'high'
 * @property {string} strengthPreference - 'delicate' | 'moderate' | 'strong'
 * @property {BrewMethod[]} favoriteMethods
 * @property {string[]} flavorPreferences - e.g. ['fruity', 'chocolatey']
 * @property {string[]} recommendedBeanIds
 * @property {string[]} recommendedAdjustmentNotes
 */

export const DEFAULT_USER_SETTINGS = {
  unitSystem: 'imperial',
  themeMode: 'system',
  soundEnabled: true,
  vibrationEnabled: true,
  timerEnabledByDefault: true,
  preferredMethod: 'pourover',
  defaultRatiosByMethod: {
    pourover: 16,
    frenchpress: 15,
    aeropress: 14,
  },
};

export const BREW_METHODS = [
  { id: 'pourover', label: 'Pour Over', icon: 'water-outline' },
  { id: 'frenchpress', label: 'French Press', icon: 'cafe-outline' },
  { id: 'aeropress', label: 'AeroPress', icon: 'flask-outline' },
];

export const GRIND_SIZES = [
  { id: 'extra-fine', label: 'Extra Fine', description: 'Powdery, like flour' },
  { id: 'fine', label: 'Fine', description: 'Like table salt' },
  { id: 'medium-fine', label: 'Medium-Fine', description: 'Between table salt and sand' },
  { id: 'medium', label: 'Medium', description: 'Like sand' },
  { id: 'medium-coarse', label: 'Medium-Coarse', description: 'Like rough sand' },
  { id: 'coarse', label: 'Coarse', description: 'Like sea salt' },
];

export const ROAST_LEVELS = [
  { id: 'light', label: 'Light' },
  { id: 'medium-light', label: 'Medium-Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'medium-dark', label: 'Medium-Dark' },
  { id: 'dark', label: 'Dark' },
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Easy', description: 'Simple and forgiving' },
  { id: 'standard', label: 'Standard', description: 'Balanced precision' },
  { id: 'nerdy', label: 'Nerdy', description: 'Full control, fine-tuned' },
];

export const FLAVOR_GOAL_TAGS = [
  'sweet', 'balanced', 'bright', 'chocolatey', 'clean', 'bold',
];

export const TASTE_TAGS = [
  'sweet', 'bright', 'chocolatey', 'fruity', 'thin', 'heavy',
  'bitter', 'smooth', 'floral', 'nutty', 'caramel',
];

export const BREW_OUTCOMES = [
  { id: 'too-sour', label: 'Too Sour' },
  { id: 'too-bitter', label: 'Too Bitter' },
  { id: 'just-right', label: 'Just Right' },
];
