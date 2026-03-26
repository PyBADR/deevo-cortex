import { useState, useCallback } from 'react';

export type Locale = 'en' | 'ar';

const labels: Record<string, Record<Locale, string>> = {
  // App
  "app.title": { en: "DEEVO", ar: "ديڤو" },
  "app.subtitle": { en: "Decision Intelligence", ar: "ذكاء القرار" },
  "app.tagline": { en: "GCC Insurance Analytics", ar: "تحليلات التأمين الخليجية" },

  // Navigation
  "nav.monitor": { en: "Monitor", ar: "المراقبة" },
  "nav.global": { en: "Global", ar: "عالمي" },
  "nav.gcc": { en: "GCC", ar: "الخليج" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "nav.search": { en: "Search", ar: "بحث" },

  // Status
  "status.live": { en: "LIVE", ar: "مباشر" },
  "status.demo": { en: "DEMO", ar: "عرض" },
  "status.paused": { en: "PAUSED", ar: "متوقف" },

  // Decision
  "decision.title": { en: "System Decision", ar: "قرار النظام" },
  "decision.approve": { en: "APPROVE", ar: "موافقة" },
  "decision.review": { en: "REVIEW", ar: "مراجعة" },
  "decision.escalate": { en: "ESCALATE", ar: "تصعيد" },
  "decision.risk": { en: "Risk Score", ar: "درجة المخاطر" },
  "decision.confidence": { en: "Confidence", ar: "الثقة" },
  "decision.drivers": { en: "Key Drivers", ar: "المحركات الرئيسية" },

  // AI Brief
  "brief.title": { en: "AI Intelligence Brief", ar: "ملخص الذكاء الاصطناعي" },
  "brief.impact": { en: "Impact Assessment", ar: "تقييم الأثر" },
  "brief.recommendation": { en: "Recommendation", ar: "التوصية" },

  // Alerts
  "alerts.title": { en: "Alerts", ar: "التنبيهات" },
  "alerts.none": { en: "No active alerts", ar: "لا توجد تنبيهات نشطة" },

  // Scenarios
  "scenario.title": { en: "Scenarios", ar: "السيناريوهات" },
  "scenario.active": { en: "ACTIVE", ar: "نشط" },
  "scenario.oil_spike": { en: "Oil Price Spike", ar: "ارتفاع أسعار النفط" },
  "scenario.fraud_ring": { en: "Organized Fraud Ring", ar: "شبكة احتيال منظمة" },
  "scenario.supply_disruption": { en: "Supply Chain Disruption", ar: "اضطراب سلسلة الإمداد" },

  // Layers
  "layers.title": { en: "Intelligence Layers", ar: "طبقات الاستخبارات" },
  "layer.macro_risk": { en: "Macro Risk", ar: "المخاطر الكلية" },
  "layer.insurance_pressure": { en: "Insurance Pressure", ar: "ضغط التأمين" },
  "layer.claims_stress": { en: "Claims Stress", ar: "ضغط المطالبات" },
  "layer.fraud_signals": { en: "Fraud Signals", ar: "إشارات الاحتيال" },
  "layer.supply_chain": { en: "Supply Chain", ar: "سلسلة الإمداد" },
  "layer.rates_inflation": { en: "Rates & Inflation", ar: "الأسعار والتضخم" },
  "layer.regulatory": { en: "Regulatory Pressure", ar: "الضغط التنظيمي" },
  "layer.gcc_exposure": { en: "GCC Exposure", ar: "التعرض الخليجي" },
  "layer.country_focus": { en: "Country Focus", ar: "تركيز الدولة" },
  "layer.scenario_paths": { en: "Scenario Paths", ar: "مسارات السيناريو" },

  // Risk levels
  "risk.critical": { en: "Critical", ar: "حرج" },
  "risk.high": { en: "High", ar: "مرتفع" },
  "risk.moderate": { en: "Moderate", ar: "متوسط" },
  "risk.low": { en: "Low", ar: "منخفض" },

  // Countries
  "country.SA": { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  "country.AE": { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  "country.KW": { en: "Kuwait", ar: "الكويت" },
  "country.QA": { en: "Qatar", ar: "قطر" },
  "country.BH": { en: "Bahrain", ar: "البحرين" },
  "country.OM": { en: "Oman", ar: "عُمان" },
  "country.all": { en: "All GCC", ar: "جميع دول الخليج" },

  // Analytics
  "analytics.title": { en: "Analytics", ar: "التحليلات" },
  "analytics.overview": { en: "Overview", ar: "نظرة عامة" },
  "analytics.timeline": { en: "Timeline", ar: "الجدول الزمني" },

  // Settings modal
  "settings.display": { en: "Display", ar: "العرض" },
  "settings.panels": { en: "Panels", ar: "اللوحات" },
  "settings.sources": { en: "Sources", ar: "المصادر" },
  "settings.region": { en: "Region", ar: "المنطقة" },
  "settings.scenario": { en: "Scenario", ar: "السيناريو" },
  "settings.language": { en: "Language", ar: "اللغة" },

  // View modes
  "view.map": { en: "GCC Map", ar: "خريطة الخليج" },
  "view.wave": { en: "Wave Sim", ar: "محاكاة الموجة" },
  "view.cognitive": { en: "Cognitive", ar: "الإدراكي" },
  "view.precausal": { en: "Pre-Causal", ar: "ما قبل السببي" },
  "view.video": { en: "Video", ar: "فيديو" },

  // Directions
  "dir.rising": { en: "Rising", ar: "صاعد" },
  "dir.falling": { en: "Falling", ar: "هابط" },
  "dir.stable": { en: "Stable", ar: "مستقر" },
};

export function t(key: string, locale: Locale = 'en'): string {
  return labels[key]?.[locale] ?? labels[key]?.en ?? key;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>('en');
  const toggle = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'en' ? 'ar' : 'en';
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      return next;
    });
  }, []);
  return { locale, setLocale, toggle, isRTL: locale === 'ar' };
}
