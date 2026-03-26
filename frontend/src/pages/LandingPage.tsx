import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-d-bg text-d-text overflow-hidden">
      {/* Hero Section */}
      <div className="min-h-screen bg-d-bg flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="mb-4 text-xs uppercase tracking-widest text-d-cyan/70 font-mono">
            DEEVO DECISION INTELLIGENCE
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-d-text">
            See the risk. Before the market does.
          </h1>

          <p className="text-lg md:text-xl text-d-sub mb-10 font-light">
            AI-powered decision intelligence for GCC insurance markets. Signals → Graph → Decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/command-center"
              className="inline-flex items-center gap-2 bg-d-blue hover:bg-d-blue/90 text-d-bg font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Launch Command Center
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://github.com/PyBADR/deevo-cortex"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-d-border hover:bg-d-surface text-d-text font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          <p className="text-sm text-d-muted mb-6">by Bader Alabddan</p>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center text-xs font-mono text-d-sub">
            <span className="px-3 py-1 border border-d-border rounded">v2.0.0</span>
            <span className="px-3 py-1 border border-d-border rounded">Production Ready</span>
            <span className="px-3 py-1 border border-d-border rounded">Open Source</span>
          </div>
        </div>
      </div>

      {/* The Pipeline */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">The Pipeline</h2>

        <div className="overflow-x-auto">
          <div className="flex items-center gap-4 md:gap-8 justify-center min-w-max">
            {['Signals', 'Enrichment', 'Causal Graph', 'Decision Engine', 'Executive Brief'].map((step, idx) => (
              <React.Fragment key={step}>
                <div className="bg-d-surface border border-d-blue/20 rounded-lg px-6 py-4 whitespace-nowrap">
                  <div className="text-d-blue font-mono text-sm">→ {step}</div>
                </div>
                {idx < 4 && <div className="hidden md:block text-d-blue text-2xl">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* What It Does */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">What It Does</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-d-surface border border-d-border rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-d-cyan">Reads 8 Live Signals</div>
            <p className="text-d-sub">Oil, inflation, claims, fraud, repair cost, supply chain, geopolitical, regulatory</p>
          </div>

          <div className="bg-d-surface border border-d-border rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-d-cyan">Builds Causal Graphs</div>
            <p className="text-d-sub">Maps cause-effect relationships across GCC markets in real-time</p>
          </div>

          <div className="bg-d-surface border border-d-border rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-d-cyan">Makes Decisions</div>
            <p className="text-d-sub">APPROVE / REVIEW / ESCALATE with confidence scores and briefs</p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Architecture</h2>

        <div className="bg-d-panel border border-d-border rounded-lg p-8 font-mono text-sm md:text-base">
          <div className="space-y-2 text-d-blue/80">
            <div>Data → Features → Models → Agents → APIs → UI → Governance</div>
            <div className="text-d-muted mt-6 text-xs leading-relaxed">
              7-layer decision intelligence stack optimized for real-time market signal processing and causal reasoning
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-d-border/40 mt-24 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex gap-8 text-sm">
              <a href="https://github.com/PyBADR/deevo-cortex" className="text-d-sub hover:text-d-text transition">
                GitHub
              </a>
              <Link to="/docs" className="text-d-sub hover:text-d-text transition">
                Docs
              </Link>
              <a href="https://github.com/PyBADR/deevo-cortex/blob/main/LICENSE" className="text-d-sub hover:text-d-text transition">
                MIT License
              </a>
            </div>
          </div>

          <div className="text-center text-sm text-d-muted">
            Built by Bader Alabddan
          </div>
        </div>
      </footer>
    </div>
  );
}
