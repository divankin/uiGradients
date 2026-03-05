/**
 * Seed bean data for Journey Coffee Roasters.
 *
 * These entries represent example products. The bean sync utility
 * can update this catalog from the Journey Coffee Roasters website.
 */
export const SEED_BEANS = [
  {
    id: 'bean-ethiopia-yirgacheffe',
    title: 'Ethiopia Yirgacheffe',
    url: 'https://www.journeyroasters.com/products/ethiopia-yirgacheffe',
    description:
      'A bright, aromatic coffee with floral notes and a clean, citrusy finish. Grown at high altitude in the birthplace of coffee.',
    roastLevel: 'light',
    flavorTags: ['bright', 'floral', 'citrus', 'clean'],
    recommendedMethods: ['pourover', 'aeropress'],
    recommendedRecipeIds: ['pourover-46-clarity', 'pourover-standard', 'aeropress-bright'],
    imageUrl: null,
    priceUsd: 18.00,
  },
  {
    id: 'bean-colombia-huila',
    title: 'Colombia Huila',
    url: 'https://www.journeyroasters.com/products/colombia-huila',
    description:
      'A well-balanced, sweet coffee with notes of caramel, stone fruit, and a smooth, medium body. A versatile crowd-pleaser.',
    roastLevel: 'medium',
    flavorTags: ['sweet', 'balanced', 'caramel', 'smooth'],
    recommendedMethods: ['pourover', 'frenchpress', 'aeropress'],
    recommendedRecipeIds: ['pourover-46-sweet', 'pourover-standard', 'frenchpress-classic'],
    imageUrl: null,
    priceUsd: 17.00,
  },
  {
    id: 'bean-guatemala-antigua',
    title: 'Guatemala Antigua',
    url: 'https://www.journeyroasters.com/products/guatemala-antigua',
    description:
      'Rich and chocolatey with a hint of spice and brown sugar sweetness. A comforting cup that shines in immersion brewing.',
    roastLevel: 'medium-dark',
    flavorTags: ['chocolatey', 'bold', 'sweet', 'nutty'],
    recommendedMethods: ['frenchpress', 'pourover'],
    recommendedRecipeIds: ['frenchpress-classic', 'frenchpress-bold', 'pourover-46-sweet'],
    imageUrl: null,
    priceUsd: 17.50,
  },
  {
    id: 'bean-kenya-aa',
    title: 'Kenya AA',
    url: 'https://www.journeyroasters.com/products/kenya-aa',
    description:
      'Vibrant and complex with blackcurrant, grapefruit, and a juicy body. A standout single-origin for those who love bright coffees.',
    roastLevel: 'medium-light',
    flavorTags: ['bright', 'fruity', 'bold', 'clean'],
    recommendedMethods: ['pourover', 'aeropress'],
    recommendedRecipeIds: ['pourover-46-clarity', 'aeropress-bright'],
    imageUrl: null,
    priceUsd: 20.00,
  },
  {
    id: 'bean-sumatra-mandheling',
    title: 'Sumatra Mandheling',
    url: 'https://www.journeyroasters.com/products/sumatra-mandheling',
    description:
      'Full-bodied and earthy with deep notes of dark chocolate, cedar, and a lingering finish. Perfect for lovers of bold, heavy coffee.',
    roastLevel: 'dark',
    flavorTags: ['bold', 'chocolatey', 'heavy', 'smooth'],
    recommendedMethods: ['frenchpress'],
    recommendedRecipeIds: ['frenchpress-bold', 'frenchpress-classic'],
    imageUrl: null,
    priceUsd: 18.50,
  },
  {
    id: 'bean-costa-rica-tarrazu',
    title: 'Costa Rica Tarrazu',
    url: 'https://www.journeyroasters.com/products/costa-rica-tarrazu',
    description:
      'Honey-sweet with bright apple acidity and a clean, refined finish. A beautifully balanced coffee that works with almost any brew method.',
    roastLevel: 'medium-light',
    flavorTags: ['sweet', 'balanced', 'clean', 'bright'],
    recommendedMethods: ['pourover', 'aeropress'],
    recommendedRecipeIds: ['pourover-standard', 'aeropress-standard'],
    imageUrl: null,
    priceUsd: 18.00,
  },
  {
    id: 'bean-brazil-santos',
    title: 'Brazil Santos',
    url: 'https://www.journeyroasters.com/products/brazil-santos',
    description:
      'Smooth and nutty with low acidity and a creamy body. Notes of milk chocolate and hazelnut make this an easy-drinking everyday coffee.',
    roastLevel: 'medium',
    flavorTags: ['smooth', 'nutty', 'chocolatey', 'balanced'],
    recommendedMethods: ['frenchpress', 'pourover', 'aeropress'],
    recommendedRecipeIds: ['frenchpress-classic', 'pourover-standard', 'aeropress-standard'],
    imageUrl: null,
    priceUsd: 15.50,
  },
  {
    id: 'bean-journey-house-blend',
    title: 'Journey House Blend',
    url: 'https://www.journeyroasters.com/products/house-blend',
    description:
      'Our signature blend crafted for everyday enjoyment. Balanced, sweet, and approachable with notes of chocolate, caramel, and a hint of dried fruit.',
    roastLevel: 'medium',
    flavorTags: ['balanced', 'sweet', 'chocolatey', 'smooth'],
    recommendedMethods: ['pourover', 'frenchpress', 'aeropress'],
    recommendedRecipeIds: ['pourover-standard', 'frenchpress-classic', 'aeropress-standard'],
    imageUrl: null,
    priceUsd: 15.00,
  },
];
