export type CityPresetId = 'london' | 'newyork' | 'kyoto' | 'paris' | 'alps' | 'custom';

export type MatteThemeId = 'obsidian' | 'midnight' | 'ivory' | 'emerald';

export type ImageFilterId = 'normal' | 'golden' | 'noir' | 'sunset' | 'emerald';

export type FontStyleId = 'playfair' | 'jakarta' | 'cinzel';

export interface BackgroundPreset {
  id: CityPresetId;
  name: { en: string; fr: string; zh: string };
  city: string;
  country: string;
  coordinates: string;
  imageUrl: string;
  attribution: string;
  defaultMatte: MatteThemeId;
  defaultFilter: ImageFilterId;
}

export interface OpeningConfig {
  // Background
  presetId: CityPresetId;
  customImageDataUrl: string | null;
  matteTheme: MatteThemeId;
  imageFilter: ImageFilterId;

  // Photo Crop & Position
  photoZoom: number; // 1.0 to 2.5
  photoPanX: number; // -50 to 50 (%)
  photoPanY: number; // -50 to 50 (%)

  // Text Position & Style
  textPositionY: number; // 25 to 75 (%)
  textLayout: 'two_lines' | 'single_line';
  fontStyle: FontStyleId;
  letterSpacing: number; // -0.05 to 0.35 (em)
  textSizeMultiplier: number; // 0.8 to 1.3
  showTagline: boolean;

  // Animation Intensity & Behavior
  maxExpansionZoom: number; // 10 to 35
  gestureSensitivity: number; // 0.6 to 1.8
  enableSoundChime: boolean;
  autoSnapToEnds: boolean;
  alwaysShowOnLaunch: boolean;
}

export const DEFAULT_OPENING_CONFIG: OpeningConfig = {
  presetId: 'london',
  customImageDataUrl: null,
  matteTheme: 'obsidian',
  imageFilter: 'golden',

  photoZoom: 1.05,
  photoPanX: 0,
  photoPanY: 0,

  textPositionY: 45,
  textLayout: 'two_lines',
  fontStyle: 'playfair',
  letterSpacing: 0.08,
  textSizeMultiplier: 1.0,
  showTagline: true,

  maxExpansionZoom: 22,
  gestureSensitivity: 1.0,
  enableSoundChime: true,
  autoSnapToEnds: true,
  alwaysShowOnLaunch: true,
};

export const CITY_PRESETS: BackgroundPreset[] = [
  {
    id: 'london',
    name: { en: 'London Twilight', fr: 'Crépuscule à Londres', zh: '伦敦 · 泰晤士薄暮' },
    city: 'London',
    country: 'United Kingdom',
    coordinates: '51.5074° N, 0.1278° W',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2400&q=85',
    attribution: 'London Westminster & Thames River at Dusk',
    defaultMatte: 'obsidian',
    defaultFilter: 'golden',
  },
  {
    id: 'newyork',
    name: { en: 'New York Skyline', fr: 'Skyline de New York', zh: '纽约 · 曼哈顿天际线' },
    city: 'New York',
    country: 'United States',
    coordinates: '40.7128° N, 74.0060° W',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2400&q=85',
    attribution: 'Manhattan Skyline & Golden Hour Twilight',
    defaultMatte: 'midnight',
    defaultFilter: 'sunset',
  },
  {
    id: 'kyoto',
    name: { en: 'Kyoto Zen Sanctuary', fr: 'Sanctuaire Zen de Kyoto', zh: '京都 · 禅境竹林与古刹' },
    city: 'Kyoto',
    country: 'Japan',
    coordinates: '35.0116° N, 135.7681° E',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2400&q=85',
    attribution: 'Kyoto Pagoda and Serene Bamboo Grove',
    defaultMatte: 'emerald',
    defaultFilter: 'emerald',
  },
  {
    id: 'paris',
    name: { en: 'Paris Golden Hour', fr: 'Heure Dorée à Paris', zh: '巴黎 · 塞纳河金色晨光' },
    city: 'Paris',
    country: 'France',
    coordinates: '48.8566° N, 2.3522° E',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=85',
    attribution: 'Paris Seine River & Haussmann Architecture',
    defaultMatte: 'obsidian',
    defaultFilter: 'golden',
  },
  {
    id: 'alps',
    name: { en: 'Alpine Mindful Serenity', fr: 'Sérénité Alpine', zh: '阿尔卑斯 · 静水与雪峰' },
    city: 'Swiss Alps',
    country: 'Switzerland',
    coordinates: '46.5590° N, 8.5608° E',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85',
    attribution: 'Serene Alpine Lake Reflection at Dawn',
    defaultMatte: 'midnight',
    defaultFilter: 'normal',
  },
];

export const MATTE_THEMES: Record<
  MatteThemeId,
  { name: { en: string; fr: string; zh: string }; hex: string; textColor: string; goldAccent: string }
> = {
  obsidian: {
    name: { en: 'Obsidian Noir', fr: 'Noir Obsidienne', zh: '黑曜玄石' },
    hex: '#0F1322',
    textColor: '#F8FAFC',
    goldAccent: '#FBBF24',
  },
  midnight: {
    name: { en: 'Midnight Sapphire', fr: 'Saphir de Minuit', zh: '午夜深蓝' },
    hex: '#0E172E',
    textColor: '#F1F5F9',
    goldAccent: '#F59E0B',
  },
  ivory: {
    name: { en: 'Royal Ivory', fr: 'Ivoire Royal', zh: '典雅象牙' },
    hex: '#FAF8F2',
    textColor: '#18181B',
    goldAccent: '#B45309',
  },
  emerald: {
    name: { en: 'Zen Emerald', fr: 'Émeraude Zen', zh: '禅韵苍翠' },
    hex: '#0A241C',
    textColor: '#ECFDF5',
    goldAccent: '#34D399',
  },
};

export const IMAGE_FILTERS: Record<
  ImageFilterId,
  { name: { en: string; fr: string; zh: string }; cssFilter: string }
> = {
  normal: {
    name: { en: 'Natural', fr: 'Naturel', zh: '自然原色' },
    cssFilter: 'contrast(102%) brightness(105%)',
  },
  golden: {
    name: { en: 'Golden Hour', fr: 'Heure Dorée', zh: '奢金晨曦' },
    cssFilter: 'sepia(18%) saturate(140%) brightness(112%) contrast(108%)',
  },
  sunset: {
    name: { en: 'Sunset Amber', fr: 'Ambre Crépuscule', zh: '落日余晖' },
    cssFilter: 'hue-rotate(-10deg) saturate(145%) contrast(110%) brightness(106%)',
  },
  emerald: {
    name: { en: 'Emerald Zen', fr: 'Émeraude Zen', zh: '翠玉禅意' },
    cssFilter: 'hue-rotate(20deg) saturate(125%) contrast(106%) brightness(104%)',
  },
  noir: {
    name: { en: 'Cinematic Noir', fr: 'Noir Cinématographique', zh: '黑白纪实' },
    cssFilter: 'grayscale(100%) contrast(118%) brightness(102%)',
  },
};
