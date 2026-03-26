import React, { useState } from 'react';
import { t, type Locale } from '../../lib/i18n';
import type { ScenarioId } from '../engine/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  onToggleLocale: () => void;
  activeScenario: ScenarioId;
  onSetScenario: (id: ScenarioId) => void;
}

type Tab = 'display' | 'region' | 'language';

const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  locale,
  onToggleLocale,
  activeScenario,
  onSetScenario,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('display');
  const [signalDensity, setSignalDensity] = useState<'compact' | 'normal' | 'expanded'>('normal');
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['SA']);

  const gccCountries = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'];
  const isRtl = locale === 'ar';

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const selectAllRegions = () => {
    setSelectedRegions(gccCountries);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-d-surface border border-d-border rounded-xl shadow-2xl"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-d-border">
          <h2 className={`text-lg font-semibold text-d-text ${isRtl ? 'font-ar' : 'font-sans'}`}>
            {t('nav.settings', locale)}
          </h2>
          <button
            onClick={onClose}
            className="text-d-muted hover:text-d-text transition-colors p-1"
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M15 5L5 15M5 5L15 15" />
            </svg>
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-d-border px-6">
          {(['display', 'region', 'language'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[11px] font-mono tracking-wider transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-d-blue border-d-blue'
                  : 'text-d-muted border-transparent hover:text-d-text'
              }`}
            >
              {tab === 'display' && t('settings.display', locale)}
              {tab === 'region' && t('settings.region', locale)}
              {tab === 'language' && t('settings.language', locale)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className={`block text-sm font-medium text-d-text mb-3 ${isRtl ? 'font-ar' : 'font-sans'}`}>
                  Theme
                </label>
                <div className="flex gap-2">
                  <button
                    className="flex-1 px-4 py-2 rounded bg-d-panel border border-d-blue text-d-blue text-sm font-medium transition-colors"
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Signal Density */}
              <div>
                <label className={`block text-sm font-medium text-d-text mb-3 ${isRtl ? 'font-ar' : 'font-sans'}`}>
                  Signal Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'normal', 'expanded'] as const).map((density) => (
                    <button
                      key={density}
                      onClick={() => setSignalDensity(density)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors capitalize ${
                        signalDensity === density
                          ? 'bg-d-blue text-d-bg'
                          : 'bg-d-panel border border-d-border text-d-text hover:border-d-blue'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation Toggle */}
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium text-d-text ${isRtl ? 'font-ar' : 'font-sans'}`}>
                  Animations
                </label>
                <button
                  onClick={() => setAnimationEnabled(!animationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    animationEnabled ? 'bg-d-blue' : 'bg-d-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-d-bg transition-transform ${
                      animationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Region Tab */}
          {activeTab === 'region' && (
            <div className="space-y-4">
              <button
                onClick={selectAllRegions}
                className="w-full px-4 py-2 rounded bg-d-panel border border-d-blue text-d-blue text-sm font-medium hover:bg-d-blue/10 transition-colors"
              >
                All GCC
              </button>

              <div className="grid grid-cols-3 gap-3">
                {gccCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => toggleRegion(country)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      selectedRegions.includes(country)
                        ? 'bg-d-blue text-d-bg border border-d-blue'
                        : 'bg-d-panel border border-d-border text-d-text hover:border-d-blue'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <div className="space-y-3">
              <button
                onClick={onToggleLocale}
                className={`w-full px-6 py-3 rounded bg-d-panel border transition-colors font-medium text-base ${
                  locale === 'en'
                    ? 'border-d-blue text-d-blue bg-d-blue/10'
                    : 'border-d-border text-d-text hover:border-d-blue'
                }`}
              >
                English
              </button>

              <button
                onClick={onToggleLocale}
                className={`w-full px-6 py-3 rounded bg-d-panel border transition-colors font-ar font-medium text-base ${
                  locale === 'ar'
                    ? 'border-d-blue text-d-blue bg-d-blue/10'
                    : 'border-d-border text-d-text hover:border-d-blue'
                }`}
              >
                العربية
              </button>

              <div className="mt-4 p-3 bg-d-panel rounded border border-d-border text-xs text-d-muted">
                <span className={isRtl ? 'font-ar' : 'font-sans'}>
                  {locale === 'en' ? 'Current: English' : 'الحالي: العربية'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SettingsModal };
