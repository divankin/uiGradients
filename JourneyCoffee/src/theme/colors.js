// Journey Coffee Roasters - Forest Green + Cinnabar Red
// Light and Dark mode color palettes

export const palette = {
  // Forest greens
  green900: '#0B2618',
  green800: '#1B4332',
  green700: '#2D6A4F',
  green600: '#40916C',
  green500: '#52B788',
  green400: '#74C69D',
  green300: '#95D5B2',
  green200: '#B7E4C7',
  green100: '#D8F3DC',

  // Cinnabar reds
  red900: '#5C1A1A',
  red800: '#8B2500',
  red700: '#A52A2A',
  red600: '#C0392B',
  red500: '#D44B3C',
  red400: '#E06050',
  red300: '#E88A7D',
  red200: '#F0B3AA',
  red100: '#F8D8D4',

  // Neutrals
  white: '#FFFFFF',
  gray50: '#FAFAF8',
  gray100: '#F2F0ED',
  gray200: '#E5E1DC',
  gray300: '#D1CBC3',
  gray400: '#A89E94',
  gray500: '#7A7068',
  gray600: '#5C534B',
  gray700: '#3E3832',
  gray800: '#2A2520',
  gray900: '#1A1613',
  black: '#000000',
};

export const lightTheme = {
  mode: 'light',
  primary: palette.green700,
  primaryDark: palette.green800,
  primaryLight: palette.green500,
  accent: palette.red700,
  accentLight: palette.red500,

  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  card: palette.white,
  cardBorder: palette.gray200,

  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textOnPrimary: palette.white,
  textOnAccent: palette.white,

  divider: palette.gray200,
  overlay: 'rgba(0, 0, 0, 0.4)',
  statusBar: 'dark-content',

  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  tabActive: palette.green700,
  tabInactive: palette.gray400,

  inputBackground: palette.gray100,
  inputBorder: palette.gray300,
  inputText: palette.gray900,
  placeholder: palette.gray400,

  success: '#2E7D32',
  warning: '#E65100',
  error: '#C62828',
  info: palette.green600,

  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const darkTheme = {
  mode: 'dark',
  primary: palette.green500,
  primaryDark: palette.green700,
  primaryLight: palette.green400,
  accent: palette.red500,
  accentLight: palette.red400,

  background: palette.gray900,
  surface: palette.gray800,
  surfaceElevated: palette.gray700,
  card: palette.gray800,
  cardBorder: palette.gray700,

  textPrimary: palette.gray100,
  textSecondary: palette.gray400,
  textMuted: palette.gray500,
  textOnPrimary: palette.gray900,
  textOnAccent: palette.white,

  divider: palette.gray700,
  overlay: 'rgba(0, 0, 0, 0.6)',
  statusBar: 'light-content',

  tabBar: palette.gray900,
  tabBarBorder: palette.gray800,
  tabActive: palette.green400,
  tabInactive: palette.gray500,

  inputBackground: palette.gray800,
  inputBorder: palette.gray700,
  inputText: palette.gray100,
  placeholder: palette.gray500,

  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  info: palette.green400,

  shadow: 'rgba(0, 0, 0, 0.3)',
};
