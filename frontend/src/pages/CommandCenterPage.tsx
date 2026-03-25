import { useState } from "react";
import { useIntelligence } from "../hooks/useIntelligence";
import { useLocale } from "../App";
import { listDemoScenarios } from "../lib/api";
import { TopCommandBar } from "../components/command/TopCommandBar";
import { SignalRail } from "../components/command/SignalRail";
import { GlobeCanvas } from "../components/command/GlobeCanvas";
import { DecisionRail } from "../components/command/DecisionRail";
import { ExecutiveBrief } from "../components/command/ExecutiveBrief";
import { PropagationPanel } from "../components/command/PropagationPanel";
import { ScenarioSwitcher } from "../components/command/ScenarioSwitcher";
import { CountryCard } from "../components/command/CountryCard";
import { LoadingState } from "../components/command/LoadingState";
import { EmptyState } from "../components/command/EmptyState";

export default function CommandCenterPage() {
  const { locale, setLocale } = useLocale();
  const [scenario, setScenario] = useState("oil_spike");
  const [live, setLive] = useState(false);

  const { data, countryCard, demoMeta, loading, isDemo } = useIntelligence({
    locale,
    scenario,
    live,
  });

  const scenarios = listDemoScenarios();

  if (loading && !data) return <LoadingState />;
  if (!data) return <EmptyState message="No intelligence payload available" />;

  return (
    <div className="min-h-screen bg-deevo-bg text-white">
      <TopCommandBar
        data={data.top_bar}
        locale={locale}
        onLocaleChange={setLocale}
        live={live}
        onLiveChange={setLive}
        scenario={scenario}
        isDemo={isDemo}
      />

      {isDemo && (
        <div className="border-b border-amber-500/20 bg-amber-500/5 px-6 py-2 text-center text-xs font-mono tracking-wide text-amber-300/80">
          DEMO MODE — Backend unavailable. Showing curated scenario data.
        </div>
      )}

      {demoMeta && (
        <div className="mx-auto max-w-[1600px] px-4 pt-3">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
            <div className="text-sm font-semibold text-cyan-300">{demoMeta.title}</div>
            <div className="mt-1 text-xs text-white/60 leading-relaxed">{demoMeta.headline}</div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1600px] px-4 pb-6 pt-4">
        {/* Row 1: Signals | Globe | Decisions */}
        <div className="grid grid-cols-12 gap-4">
          <section className="col-span-12 xl:col-span-3">
            <SignalRail data={data.signal_rail} locale={locale} />
          </section>

          <section className="col-span-12 xl:col-span-6">
            <GlobeCanvas data={data.graph_summary} locale={locale} />
          </section>

          <section className="col-span-12 xl:col-span-3">
            <DecisionRail data={data.decision_rail} locale={locale} />
          </section>
        </div>

        {/* Row 2: Executive Brief | Propagation */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <section className="col-span-12 lg:col-span-5">
            <ExecutiveBrief data={data.executive_brief} locale={locale} />
          </section>

          <section className="col-span-12 lg:col-span-7">
            <PropagationPanel data={data.propagation_panel} locale={locale} />
          </section>
        </div>

        {/* Row 3: Scenarios | Country Card */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <section className="col-span-12 lg:col-span-4">
            <ScenarioSwitcher
              value={scenario}
              onChange={setScenario}
              scenarios={scenarios}
              locale={locale}
            />
          </section>

          <section className="col-span-12 lg:col-span-8">
            {countryCard && countryCard.available !== false ? (
              <CountryCard data={countryCard} locale={locale} />
            ) : (
              <div className="rounded-2xl border border-deevo-border bg-deevo-surface p-6 text-center text-white/40 text-sm">
                Select a scenario to view country intelligence
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
