import React from 'react';
import { ExecutiveBriefData, Locale } from '../../types/ui';

interface ExecutiveBriefProps {
  data: ExecutiveBriefData;
  locale: Locale;
}

export const ExecutiveBrief: React.FC<ExecutiveBriefProps> = ({ data, locale }) => {
  const headline = data.brief_headline || (locale === 'ar' ? 'ملخص استخباراتي' : 'Intelligence Summary');
  const body = data.text || '';
  const generatedTime = data.generated_at
    ? new Date(data.generated_at).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-US')
    : null;

  return (
    <div className="h-full flex flex-col gap-4 p-5 bg-d-shell border border-d-border/30 rounded-xl border-l-2 border-l-cyan-500/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-d-cyan">
          {locale === 'ar' ? 'الملخص التنفيذي' : 'Executive Brief'}
        </h2>
        <span className="px-2 py-0.5 bg-cyan-950/30 border border-cyan-900/30 rounded text-[10px] font-mono text-cyan-600 uppercase tracking-wider">
          AI
        </span>
      </div>

      {/* Headline */}
      <h3 className="text-base font-bold text-white leading-snug">
        {headline}
      </h3>

      {/* Body */}
      {body && (
        <p className="flex-1 text-sm text-d-sub leading-relaxed whitespace-pre-wrap">
          {body}
        </p>
      )}

      {/* Timestamp */}
      {generatedTime && (
        <div className="pt-3 border-t border-d-border/20">
          <p className="text-[10px] text-d-muted font-mono">
            {locale === 'ar' ? 'تم الإنشاء' : 'Generated'} {generatedTime}
          </p>
        </div>
      )}
    </div>
  );
};
