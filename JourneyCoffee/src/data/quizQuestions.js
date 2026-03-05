/**
 * Quiz questions for the taste preference profile.
 */
export const QUIZ_QUESTIONS = [
  {
    id: 'flavor_direction',
    question: 'Do you prefer brighter or richer coffee?',
    field: 'preferredFlavorDirection',
    options: [
      { value: 'bright', label: 'Bright and lively', description: 'Fruity, floral, citrusy notes' },
      { value: 'balanced', label: 'Somewhere in between', description: 'A mix of sweetness, clarity, and body' },
      { value: 'rich', label: 'Rich and deep', description: 'Chocolatey, nutty, full-bodied' },
    ],
  },
  {
    id: 'body_preference',
    question: 'How do you like the body of your coffee?',
    field: 'bodyPreference',
    options: [
      { value: 'light', label: 'Light and tea-like', description: 'Delicate, silky, and clean' },
      { value: 'medium', label: 'Medium and smooth', description: 'Balanced weight in the cup' },
      { value: 'heavy', label: 'Heavy and full', description: 'Thick, rich mouthfeel' },
    ],
  },
  {
    id: 'acidity_preference',
    question: 'How much acidity do you enjoy?',
    field: 'acidityPreference',
    options: [
      { value: 'low', label: 'Very little', description: 'Smooth, mellow, no tang' },
      { value: 'medium', label: 'Some acidity is nice', description: 'A gentle brightness' },
      { value: 'high', label: 'I love it', description: 'Juicy, vibrant, lively' },
    ],
  },
  {
    id: 'strength_preference',
    question: 'Do you like stronger or more delicate cups?',
    field: 'strengthPreference',
    options: [
      { value: 'delicate', label: 'Delicate and gentle', description: 'Lighter, more nuanced' },
      { value: 'moderate', label: 'Moderate strength', description: 'Balanced concentration' },
      { value: 'strong', label: 'Strong and bold', description: 'Punchy, concentrated' },
    ],
  },
  {
    id: 'flavor_preferences',
    question: 'What flavors do you enjoy most?',
    field: 'flavorPreferences',
    multiSelect: true,
    options: [
      { value: 'fruity', label: 'Fruity', description: 'Berry, citrus, tropical' },
      { value: 'chocolatey', label: 'Chocolatey', description: 'Cocoa, dark chocolate, mocha' },
      { value: 'nutty', label: 'Nutty', description: 'Hazelnut, almond, peanut' },
      { value: 'floral', label: 'Floral', description: 'Jasmine, lavender, rose' },
      { value: 'caramel', label: 'Caramel and Sweet', description: 'Brown sugar, honey, toffee' },
      { value: 'bold', label: 'Earthy and Bold', description: 'Spice, cedar, tobacco' },
    ],
  },
  {
    id: 'favorite_methods',
    question: 'What brew method do you use most often?',
    field: 'favoriteMethods',
    multiSelect: true,
    options: [
      { value: 'pourover', label: 'Pour Over' },
      { value: 'frenchpress', label: 'French Press' },
      { value: 'aeropress', label: 'AeroPress' },
    ],
  },
];
