import { useEffect, useState, useCallback } from "react";
import { fetchCommandCenter, checkHealth, getDemoPayload, getDemoMeta } from "../lib/api";
import type { CommandCenterPayload, CountryCardData, Locale } from "../types/ui";

interface UseIntelligenceParams {
  locale: Locale;
  countryId?: string;
  scenario: string;
  live?: boolean;
}

interface IntelligenceState {
  data: CommandCenterPayload | null;
  countryCard: CountryCardData | null;
  demoMeta: { title: string; headline: string; narrative: string; talking_points: string[]; kpi?: Record<string, any> } | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
}

export function useIntelligence(params: UseIntelligenceParams): IntelligenceState & { reload: () => void } {
  const [state, setState] = useState<IntelligenceState>({
    data: null, countryCard: null, demoMeta: null, loading: true, error: null, isDemo: false,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const alive = await checkHealth();
    if (alive) {
      try {
        const res = await fetchCommandCenter({ locale: params.locale, country_id: params.countryId });
        setState({ data: res, countryCard: null, demoMeta: null, loading: false, error: null, isDemo: false });
        return;
      } catch { /* fall through to demo */ }
    }
    // Demo fallback
    const payload = getDemoPayload(params.scenario);
    const { meta, country_card } = getDemoMeta(params.scenario);
    setState({
      data: payload,
      countryCard: country_card,
      demoMeta: meta,
      loading: false,
      error: null,
      isDemo: true,
    });
  }, [params.locale, params.countryId, params.scenario]);

  useEffect(() => {
    load();
    if (!params.live) return;
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [load, params.live]);

  return { ...state, reload: load };
}
