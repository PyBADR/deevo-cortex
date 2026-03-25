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
    <div className="h-full flex flex-col gap-4 p-5 bg-[#080c14] border border-white/[0.06] rounded-xl border-l-2 border-l-cyan-500/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
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
        <p className="flex-1 text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
          {body}
        </p>
      )}

      {/* Timestamp */}
      {generatedTime && (
        <div className="pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-mono">
            {locale === 'ar' ? 'تم الإنشاء' : 'Generated'} {generatedTime}
          </p>
        </div>
      )}
    </div>
  );
};
