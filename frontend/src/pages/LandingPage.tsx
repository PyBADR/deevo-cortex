import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05070b] text-white overflow-hidden">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-bg {
          background: linear-gradient(135deg, #05070b 0%, #1a1f3a 25%, #0f1e4d 50%, #05070b 75%, #05070b 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }

        .text-shadow-lg {
          text-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
        }
      `}
      </style>

      {/* Hero Section */}
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="mb-4 text-xs uppercase tracking-widest text-cyan-400/70 font-mono">
            DEEVO DECISION INTELLIGENCE
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-shadow-lg">
            See the risk. Before the market does.
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-10 font-light">
            AI-powered decision intelligence for GCC insurance markets. Signals → Graph → Decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/command-center"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Launch Command Center
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://github.com/PyBADR/deevo-cortex"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/5 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>

          <p className="text-sm text-gray-500 mb-6">by Bader Alabddan</p>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center text-xs font-mono text-gray-400">
            <span className="px-3 py-1 border border-gray-700 rounded">v2.0.0</span>
            <span className="px-3 py-1 border border-gray-700 rounded">Production Ready</span>
            <span className="px-3 py-1 border border-gray-700 rounded">Open Source</span>
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
                <div className="bg-black/40 border border-cyan-500/30 rounded-lg px-6 py-4 whitespace-nowrap">
                  <div className="text-cyan-400 font-mono text-sm">→ {step}</div>
                </div>
                {idx < 4 && <div className="hidden md:block text-cyan-400 text-2xl">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* What It Does */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">What It Does</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-cyan-400">Reads 8 Live Signals</div>
            <p className="text-white/70">Oil, inflation, claims, fraud, repair cost, supply chain, geopolitical, regulatory</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-cyan-400">Builds Causal Graphs</div>
            <p className="text-white/70">Maps cause-effect relationships across GCC markets in real-time</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-lg p-8">
            <div className="text-2xl font-bold mb-4 text-cyan-400">Makes Decisions</div>
            <p className="text-white/70">APPROVE / REVIEW / ESCALATE with confidence scores and briefs</p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Architecture</h2>

        <div className="bg-black/50 border border-cyan-500/20 rounded-lg p-8 font-mono text-sm md:text-base">
          <div className="space-y-2 text-cyan-400/80">
            <div>Data → Features → Models → Agents → APIs → UI → Governance</div>
            <div className="text-white/40 mt-6 text-xs leading-relaxed">
              7-layer decision intelligence stack optimized for real-time market signal processing and causal reasoning
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex gap-8 text-sm">
              <a href="https://github.com/PyBADR/deevo-cortex" className="text-gray-400 hover:text-white transition">
                GitHub
              </a>
              <Link to="/docs" className="text-gray-400 hover:text-white transition">
                Docs
              </Link>
              <a href="https://github.com/PyBADR/deevo-cortex/blob/main/LICENSE" className="text-gray-400 hover:text-white transition">
                MIT License
              </a>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Built by Bader Alabddan
          </div>
        </div>
      </footer>
    </div>
  );
}