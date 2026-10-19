import React, { useState, useRef } from 'react';
import {
  X,
  Sliders,
  Image as ImageIcon,
  Crop,
  Type,
  Zap,
  Upload,
  Trash2,
  RotateCcw,
  Check,
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  OpeningConfig,
  CITY_PRESETS,
  MATTE_THEMES,
  IMAGE_FILTERS,
  CityPresetId,
  MatteThemeId,
  ImageFilterId,
  FontStyleId,
  DEFAULT_OPENING_CONFIG,
} from '../../types/opening';
import { Language } from '../../types';

interface OpeningCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OpeningConfig;
  onChangeConfig: (newConfig: OpeningConfig) => void;
  language: Language;
}

export const OpeningCustomizerModal: React.FC<OpeningCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'background' | 'crop' | 'text' | 'animation'>('background');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const t = {
    title: {
      en: 'Opening & Portal Customizer',
      fr: 'Personnalisation de l’Ouverture',
      zh: '沉浸开场与镂空艺术定制',
    },
    subtitle: {
      en: 'Tailor city backgrounds, letter typography, crop & animation dynamics',
      fr: 'Ajustez l’arrière-plan, la typographie ajourée et la dynamique d’animation',
      zh: '定制城市背景、镂空字形排版、照片裁切与全屏缩放动画',
    },
    tabs: {
      background: { en: 'Background', fr: 'Arrière-plan', zh: '城市与背景' },
      crop: { en: 'Photo Crop', fr: 'Cadrage Photo', zh: '照片裁切' },
      text: { en: 'Typography', fr: 'Typographie', zh: '文字与位置' },
      animation: { en: 'Dynamics', fr: 'Animation', zh: '动画强度' },
    },
    presetsHeading: {
      en: 'Curated City Portals',
      fr: 'Portails Urbains',
      zh: '城市艺术预设',
    },
    customUpload: {
      en: 'Upload Your Photo',
      fr: 'Importer Votre Photo',
      zh: '上传自定义照片',
    },
    customActive: {
      en: 'Custom photo active',
      fr: 'Photo personnalisée active',
      zh: '当前正在使用自定义照片',
    },
    clearUpload: {
      en: 'Use City Preset',
      fr: 'Revenir au préréglage',
      zh: '恢复城市预设',
    },
    matteTheme: {
      en: 'Matte Border Color',
      fr: 'Couleur du Passe-Partout',
      zh: '外框封套基色',
    },
    colorFilter: {
      en: 'Atmospheric Filter',
      fr: 'Filtre Atmosphérique',
      zh: '胶片光影滤镜',
    },
    photoZoom: {
      en: 'Photo Zoom',
      fr: 'Zoom de la Photo',
      zh: '照片缩放倍率',
    },
    photoPanX: {
      en: 'Horizontal Pan (X)',
      fr: 'Déplacement Horizontal (X)',
      zh: '水平偏移 (X轴)',
    },
    photoPanY: {
      en: 'Vertical Pan (Y)',
      fr: 'Déplacement Vertical (Y)',
      zh: '垂直偏移 (Y轴)',
    },
    textPositionY: {
      en: 'Headline Vertical Position',
      fr: 'Position Verticale du Titre',
      zh: '镂空标题垂直位置',
    },
    layout: {
      en: 'Text Layout',
      fr: 'Disposition',
      zh: '字形排列模式',
    },
    twoLines: {
      en: 'Stacked (VENTURE / MIND)',
      fr: 'Empilé (VENTURE / MIND)',
      zh: '双层叠字 (VENTURE / MIND)',
    },
    singleLine: {
      en: 'Horizontal (VENTURE MIND)',
      fr: 'Horizontal (VENTURE MIND)',
      zh: '单行横排 (VENTURE MIND)',
    },
    fontStyle: {
      en: 'Typography Style',
      fr: 'Style de Police',
      zh: '标题字体形态',
    },
    letterSpacing: {
      en: 'Letter Spacing / Tracking',
      fr: 'Espacement des Lettres',
      zh: '字间距 (Tracking)',
    },
    taglineToggle: {
      en: 'Show Subtitle & Tagline',
      fr: 'Afficher le sous-titre',
      zh: '显示副标题与经纬度元数据',
    },
    maxZoom: {
      en: 'Max Expansion Zoom',
      fr: 'Grossissement Maximal',
      zh: '全屏最大展开倍数',
    },
    sensitivity: {
      en: 'Gesture Scroll Sensitivity',
      fr: 'Sensibilité du Balayage',
      zh: '滑动与滚轮手势灵敏度',
    },
    soundChime: {
      en: 'Zen Chime on Full Screen',
      fr: 'Carillon Zen au Plein Écran',
      zh: '展开至全屏时鸣响藏钵金声',
    },
    autoSnap: {
      en: 'Auto-Snap to Ends on Release',
      fr: 'Attraction Magnétique aux Extrémités',
      zh: '松手自动吸附至全屏或封面',
    },
    alwaysShow: {
      en: 'Always Show on App Launch',
      fr: 'Afficher à chaque lancement',
      zh: '每次进入应用首先展示艺术主页',
    },
    resetDefaults: {
      en: 'Reset to Defaults',
      fr: 'Réinitialiser',
      zh: '恢复默认设置',
    },
    done: {
      en: 'Done & Return to Portal',
      fr: 'Terminer',
      zh: '完成并返回封面',
    },
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('Photo is larger than 12MB. Please select an image under 12MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChangeConfig({
          ...config,
          presetId: 'custom',
          customImageDataUrl: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearCustomPhoto = () => {
    onChangeConfig({
      ...config,
      presetId: 'london',
      customImageDataUrl: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-stone-900/95 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-stone-100 flex items-center gap-2">
                {t.title[language]}
              </h2>
              <p className="text-xs text-stone-400 truncate max-w-sm sm:max-w-md">
                {t.subtitle[language]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-stone-950/40 px-3 pt-2 gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'background' as const, label: t.tabs.background[language], icon: ImageIcon },
            { id: 'crop' as const, label: t.tabs.crop[language], icon: Crop },
            { id: 'text' as const, label: t.tabs.text[language], icon: Type },
            { id: 'animation' as const, label: t.tabs.animation[language], icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 border-t-2 border-amber-400 text-amber-300 font-semibold shadow-xs'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar">
          {/* TAB 1: BACKGROUND */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* City Presets */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">
                  {t.presetsHeading[language]}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CITY_PRESETS.map((preset) => {
                    const isSelected = config.presetId === preset.id && !config.customImageDataUrl;
                    return (
                      <button
                        key={preset.id}
                        onClick={() =>
                          onChangeConfig({
                            ...config,
                            presetId: preset.id,
                            customImageDataUrl: null,
                            matteTheme: preset.defaultMatte,
                            imageFilter: preset.defaultFilter,
                          })
                        }
                        className={`relative rounded-2xl overflow-hidden border p-2 text-left transition-all group active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="h-20 rounded-xl overflow-hidden mb-2 relative">
                          <img
                            src={preset.imageUrl}
                            alt={preset.city}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-stone-200">
                            {preset.coordinates}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white truncate">
                          {preset.name[language]}
                        </div>
                        <div className="text-[11px] text-stone-400">{preset.country}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Photo Upload */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-stone-200">
                      {t.customUpload[language]}
                    </span>
                  </div>
                  {config.customImageDataUrl && (
                    <button
                      onClick={clearCustomPhoto}
                      className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.clearUpload[language]}</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {config.customImageDataUrl ? (
                  <div className="flex items-center space-x-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <img
                      src={config.customImageDataUrl}
                      alt="Custom preview"
                      className="w-16 h-12 rounded-lg object-cover border border-amber-400/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-amber-300">
                        {t.customActive[language]}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-stone-400 underline hover:text-white"
                      >
                        {language === 'zh'
                          ? '更换照片...'
                          : language === 'fr'
                          ? 'Changer la photo...'
                          : 'Replace photo...'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border border-dashed border-amber-500/30 hover:border-amber-400 rounded-xl text-center text-xs text-stone-300 hover:text-white hover:bg-amber-500/5 transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-amber-400 animate-bounce" />
                    <span>
                      {language === 'zh'
                        ? '点击上传本地高清风景或建筑照片 (支持JPG/PNG/WebP)'
                        : language === 'fr'
                        ? 'Cliquez pour importer votre photo (JPG, PNG, WebP)'
                        : 'Click to upload your own landscape or architecture photo'}
                    </span>
                  </button>
                )}
              </div>

              {/* Matte Theme */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2.5">
                  {t.matteTheme[language]}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(Object.keys(MATTE_THEMES) as MatteThemeId[]).map((themeKey) => {
                    const theme = MATTE_THEMES[themeKey];
                    const isSelected = config.matteTheme === themeKey;
                    return (
                      <button
                        key={themeKey}
                        onClick={() => onChangeConfig({ ...config, matteTheme: themeKey })}
                        className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/30 bg-stone-800'
                            : 'border-white/10 hover:border-white/20 bg-stone-950/40'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/30 shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.hex }}
                        />
                        <span className="text-xs font-medium text-stone-200">
                          {theme.name[language]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Atmosphere Filter */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2.5">
                  {t.colorFilter[language]}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(Object.keys(IMAGE_FILTERS) as ImageFilterId[]).map((filterKey) => {
                    const filter = IMAGE_FILTERS[filterKey];
                    const isSelected = config.imageFilter === filterKey;
                    return (
                      <button
                        key={filterKey}
                        onClick={() => onChangeConfig({ ...config, imageFilter: filterKey })}
                        className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-semibold shadow-xs'
                            : 'border-white/10 text-stone-400 hover:text-white bg-stone-950/40'
                        }`}
                      >
                        {filter.name[language]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO CROP & PAN */}
          {activeTab === 'crop' && (
            <div className="space-y-6">
              {/* Photo Zoom */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.photoZoom[language]}</span>
                  <span className="font-mono text-amber-400">
                    {Math.round(config.photoZoom * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={config.photoZoom}
                  onChange={(e) =>
                    onChangeConfig({ ...config, photoZoom: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>100% (Fit)</span>
                  <span>150%</span>
                  <span>250% (Close Up)</span>
                </div>
              </div>

              {/* Horizontal Pan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.photoPanX[language]}</span>
                  <span className="font-mono text-amber-400">{config.photoPanX}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="2"
                  value={config.photoPanX}
                  onChange={(e) =>
                    onChangeConfig({ ...config, photoPanX: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>← Left (-40%)</span>
                  <span>Center (0)</span>
                  <span>Right (+40%) →</span>
                </div>
              </div>

              {/* Vertical Pan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.photoPanY[language]}</span>
                  <span className="font-mono text-amber-400">{config.photoPanY}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="2"
                  value={config.photoPanY}
                  onChange={(e) =>
                    onChangeConfig({ ...config, photoPanY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>↑ Sky / Top (-40%)</span>
                  <span>Center (0)</span>
                  <span>Ground / Bottom (+40%) ↓</span>
                </div>
              </div>

              {/* Quick Reset for Crop */}
              <button
                onClick={() => onChangeConfig({ ...config, photoZoom: 1.05, photoPanX: 0, photoPanY: 0 })}
                className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {language === 'zh'
                    ? '重置照片位置与缩放'
                    : language === 'fr'
                    ? 'Réinitialiser le cadrage'
                    : 'Reset photo zoom & pan'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY & TEXT POSITION */}
          {activeTab === 'text' && (
            <div className="space-y-6">
              {/* Vertical Position */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.textPositionY[language]}</span>
                  <span className="font-mono text-amber-400">{config.textPositionY}%</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="70"
                  step="1"
                  value={config.textPositionY}
                  onChange={(e) =>
                    onChangeConfig({ ...config, textPositionY: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: { en: 'Top', fr: 'Haut', zh: '偏上 (32%)' }, val: 32 },
                    { label: { en: 'Golden Ratio', fr: 'Nombre d’Or', zh: '黄金分割 (42%)' }, val: 42 },
                    { label: { en: 'Center', fr: 'Centre', zh: '居中 (50%)' }, val: 50 },
                    { label: { en: 'Lower', fr: 'Bas', zh: '偏下 (60%)' }, val: 60 },
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => onChangeConfig({ ...config, textPositionY: p.val })}
                      className={`text-[11px] py-1.5 rounded-lg border text-center transition-all ${
                        config.textPositionY === p.val
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-semibold'
                          : 'border-white/10 text-stone-400 hover:text-white'
                      }`}
                    >
                      {p.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Layout Mode */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400">
                  {t.layout[language]}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onChangeConfig({ ...config, textLayout: 'two_lines' })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      config.textLayout === 'two_lines'
                        ? 'border-amber-400 bg-amber-500/15 text-white ring-2 ring-amber-400/30'
                        : 'border-white/10 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div className="text-sm font-bold font-serif-luxury tracking-wider text-amber-300">
                      VENTURE <br /> MIND
                    </div>
                    <div className="text-xs text-stone-400 mt-1">{t.twoLines[language]}</div>
                  </button>

                  <button
                    onClick={() => onChangeConfig({ ...config, textLayout: 'single_line' })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      config.textLayout === 'single_line'
                        ? 'border-amber-400 bg-amber-500/15 text-white ring-2 ring-amber-400/30'
                        : 'border-white/10 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <div className="text-sm font-bold font-serif-luxury tracking-widest text-amber-300">
                      VENTURE MIND
                    </div>
                    <div className="text-xs text-stone-400 mt-1">{t.singleLine[language]}</div>
                  </button>
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.letterSpacing[language]}</span>
                  <span className="font-mono text-amber-400">{config.letterSpacing}em</span>
                </div>
                <input
                  type="range"
                  min="-0.03"
                  max="0.30"
                  step="0.02"
                  value={config.letterSpacing}
                  onChange={(e) =>
                    onChangeConfig({ ...config, letterSpacing: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Font Family Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400">
                  {t.fontStyle[language]}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onChangeConfig({ ...config, fontStyle: 'playfair' })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      config.fontStyle === 'playfair'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="font-serif-luxury text-sm">Playfair Luxury Serif</span>
                  </button>
                  <button
                    onClick={() => onChangeConfig({ ...config, fontStyle: 'jakarta' })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      config.fontStyle === 'jakarta'
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300 font-bold'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span className="font-sans font-black text-sm">Plus Jakarta Modern</span>
                  </button>
                </div>
              </div>

              {/* Tagline Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-950/60 border border-white/10">
                <span className="text-xs font-semibold text-stone-200">
                  {t.taglineToggle[language]}
                </span>
                <input
                  type="checkbox"
                  checked={config.showTagline}
                  onChange={(e) => onChangeConfig({ ...config, showTagline: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATION DYNAMICS & BEHAVIOR */}
          {activeTab === 'animation' && (
            <div className="space-y-6">
              {/* Max Expansion Zoom */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.maxZoom[language]}</span>
                  <span className="font-mono text-amber-400">{config.maxExpansionZoom}x</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="35"
                  step="1"
                  value={config.maxExpansionZoom}
                  onChange={(e) =>
                    onChangeConfig({ ...config, maxExpansionZoom: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>12x (Gentle)</span>
                  <span>22x (Cinematic)</span>
                  <span>35x (Deep Portal)</span>
                </div>
              </div>

              {/* Gesture Sensitivity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-200">{t.sensitivity[language]}</span>
                  <span className="font-mono text-amber-400">{config.gestureSensitivity}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.gestureSensitivity}
                  onChange={(e) =>
                    onChangeConfig({ ...config, gestureSensitivity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  <span>Smooth Long Swipe</span>
                  <span>Standard</span>
                  <span>Snappy Rapid</span>
                </div>
              </div>

              {/* Sound Chime Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-950/60 border border-white/10">
                <div className="flex items-center space-x-2.5">
                  {config.enableSoundChime ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-stone-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-stone-200">
                      {t.soundChime[language]}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {language === 'zh'
                        ? '使用 Web Audio 合成器在全屏展开瞬间鸣响治愈古铜颂钵'
                        : 'Synthesizes authentic resonant bronze singing bowl'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSoundChime}
                  onChange={(e) => onChangeConfig({ ...config, enableSoundChime: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Auto Snap to Ends */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-950/60 border border-white/10">
                <div>
                  <div className="text-xs font-semibold text-stone-200">
                    {t.autoSnap[language]}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {language === 'zh'
                      ? '松手时自动平滑过渡至完全展开或收拢'
                      : 'Smoothly glides to 0% or 100% on release'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoSnapToEnds}
                  onChange={(e) => onChangeConfig({ ...config, autoSnapToEnds: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Always Show on Launch */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div>
                  <div className="text-xs font-semibold text-amber-300">
                    {t.alwaysShow[language]}
                  </div>
                  <div className="text-[11px] text-stone-300">
                    {language === 'zh'
                      ? '符合要求：用户每次进入应用，首先看到艺术主页'
                      : 'Always display art portal when entering application'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.alwaysShowOnLaunch}
                  onChange={(e) =>
                    onChangeConfig({ ...config, alwaysShowOnLaunch: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between bg-stone-950/80">
          <button
            onClick={() => onChangeConfig(DEFAULT_OPENING_CONFIG)}
            className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefaults[language]}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t.done[language]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
