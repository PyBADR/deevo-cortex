import { Link } from "react-router-dom";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-d-bg text-d-text">
      <div className="mx-auto max-w-[900px] px-6 py-20">
        <Link
          to="/"
          className="mb-8 inline-block text-sm text-d-blue hover:underline"
        >
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold">Documentation</h1>

        <div className="space-y-12">
          {/* Architecture */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-d-blue">
              Architecture
            </h2>
            <div className="space-y-3 text-d-sub">
              <p>DEEVO Cortex is built on a 7-layer decision intelligence stack:</p>
              <ol className="list-inside list-decimal space-y-2 ml-2">
                <li><strong>Data Ingestion</strong> - Real-time signal collection from GCC markets</li>
                <li><strong>Signal Processing</strong> - Normalize and contextualize incoming data streams</li>
                <li><strong>Causal Graph</strong> - Build relationships between signals and outcomes</li>
                <li><strong>Propagation Engine</strong> - Simulate cascading effects through the graph</li>
                <li><strong>Decision Logic</strong> - Apply business rules and risk assessment</li>
                <li><strong>Executive Layer</strong> - Generate briefings with confidence scores</li>
                <li><strong>API & UI</strong> - Expose intelligence through REST APIs and web interface</li>
              </ol>
            </div>
          </section>

          {/* API Reference */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-d-blue">
              API Reference
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-d-border bg-d-surface p-4">
                <code className="text-sm text-d-cyan">GET /api/health</code>
                <p className="mt-2 text-sm text-d-sub">Check backend connection status</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-surface p-4">
                <code className="text-sm text-d-cyan">GET /api/settings</code>
                <p className="mt-2 text-sm text-d-sub">Get configuration and available scenarios</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-surface p-4">
                <code className="text-sm text-d-cyan">POST /api/intelligence/ui</code>
                <p className="mt-2 text-sm text-d-sub">Get UI-optimized intelligence payload</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-surface p-4">
                <code className="text-sm text-d-cyan">POST /api/intelligence/run</code>
                <p className="mt-2 text-sm text-d-sub">Execute intelligence computation on custom scenarios</p>
              </div>
            </div>
          </section>

          {/* Demo Scenarios */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-d-blue">
              Demo Scenarios
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-d-border bg-d-panel p-4">
                <div className="font-semibold text-d-blue">Oil Price Spike</div>
                <p className="mt-1 text-sm text-d-sub">GCC markets react to geopolitical oil disruptions and OPEC+ decisions</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-panel p-4">
                <div className="font-semibold text-d-blue">Fraud Surge</div>
                <p className="mt-1 text-sm text-d-sub">Insurance fraud waves and their cascading effects on portfolio risk</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-panel p-4">
                <div className="font-semibold text-d-blue">Inflation Crisis</div>
                <p className="mt-1 text-sm text-d-sub">Central bank policy responses and their propagation across GCC economies</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-panel p-4">
                <div className="font-semibold text-d-blue">Regulatory Changes</div>
                <p className="mt-1 text-sm text-d-sub">New insurance regulations and their impact on underwriting strategies</p>
              </div>
              <div className="rounded-lg border border-d-border bg-d-panel p-4">
                <div className="font-semibold text-d-blue">Supply Chain Shock</div>
                <p className="mt-1 text-sm text-d-sub">Global logistics disruptions affecting GCC trade and commerce insurance</p>
              </div>
            </div>
          </section>

          {/* Deployment */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-d-blue">
              Deployment
            </h2>
            <p className="mb-3 text-d-sub">DEEVO Cortex is optimized for serverless deployment on Vercel.</p>
            <div className="rounded-lg border border-d-border bg-d-surface p-4">
              <p className="text-sm text-d-muted mb-2">One-click Vercel deployment:</p>
              <a
                href="https://vercel.com/new/clone?repository-url=https://github.com/PyBADR/deevo-cortex"
                target="_blank"
                rel="noreferrer"
                className="text-d-blue hover:underline text-sm"
              >
                Deploy to Vercel
              </a>
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-d-blue">
              Getting Started
            </h2>
            <p className="text-d-sub">
              DEEVO Cortex is a production-grade Decision Intelligence platform that transforms real-time signals into actionable insights through causal graph analysis. Start with the demo above or deploy your own instance.
            </p>
          </section>
        </div>

        {/* Links */}
        <div className="mt-12 border-t border-d-border/40 pt-8 flex gap-6 text-sm">
          <a href="https://github.com/PyBADR/deevo-cortex" target="_blank" rel="noreferrer" className="text-d-blue hover:underline">
            GitHub Repository
          </a>
          <Link to="/" className="text-d-blue hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
