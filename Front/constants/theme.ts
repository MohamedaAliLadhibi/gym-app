/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Global app palette
// Primary colors requested: white, grey, orange & black (in that order)
export const Palette = {
  white: '#FFFFFF',
  // Greys
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray700: '#374151',
  // Accent orange
  orange: '#F97316',
  orangeDark: '#EA580C',
  // Black
  black: '#111827',
};

const tintColorLight = Palette.orange;
const tintColorDark = Palette.orange;

export const Colors = {
  light: {
    text: Palette.black,
    background: Palette.white,
    tint: tintColorLight,
    icon: Palette.gray500,
    tabIconDefault: Palette.gray500,
    tabIconSelected: tintColorLight,
    border: Palette.gray200,
    mutedText: Palette.gray500,
    card: Palette.white,
    surface: Palette.gray50,
  },
  dark: {
    text: Palette.white,
    background: Palette.black,
    tint: tintColorDark,
    icon: Palette.gray300,
    tabIconDefault: Palette.gray300,
    tabIconSelected: tintColorDark,
    border: Palette.gray700,
    mutedText: Palette.gray300,
    card: '#020617',
    surface: '#020617',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
