export const Colors = {
  primary: '#03045e',
  primaryLight: '#0077b6',
  background: '#caf0f8',
  backgroundDark: '#ade8f4',
  white: '#ffffff',
  cardBg: '#ffffff',
  textPrimary: '#03045e',
  textSecondary: '#555555',
  textMuted: '#888888',
  accent: '#0096c7',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  border: '#e2eef2',
  inputBg: '#eaf6fa',
  overlay: 'rgba(3, 4, 94, 0.6)',
  tagBg: 'rgba(3, 4, 94, 0.12)',
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
};

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  headerBold: 'PlusJakartaSans_700Bold',
  headerExtraBold: 'PlusJakartaSans_800ExtraBold',
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#03045e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    shadowColor: '#03045e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
};
