# DEEVO Cortex — Launch Checklist

> Final verification pass before public GitHub release and Vercel deployment.
> Date: 2026-03-25 | Version: 2.0.0 | Author: Bader Alabddan

---

## 1. Routes & Navigation

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1.1 | `/` renders LandingPage | PASS | Hero, pipeline, capabilities, architecture, footer |
| 1.2 | `/command-center` renders CommandCenterPage | PASS | All 8 components compose correctly |
| 1.3 | `/docs` renders DocsPage | PASS | Architecture, API, scenarios, deployment sections |
| 1.4 | `/*` renders NotFoundPage (404) | PASS | 404 with Go Home link back to `/` |
| 1.5 | Internal `<Link>` navigation works | PASS | Landing→CC, Landing→Docs, Docs→Home, 404→Home |
| 1.6 | BrowserRouter wraps all routes | PASS | `main.tsx` → `<BrowserRouter><App/></BrowserRouter>` |

## 2. Bilingual EN/AR Toggle

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 2.1 | LocaleContext provided at App root | PASS | `useState<Locale>("en")` default |
| 2.2 | `dir` attribute toggles `rtl`/`ltr` | PASS | `dir={locale === "ar" ? "rtl" : "ltr"}` on root div |
| 2.3 | TopCommandBar locale toggle button | PASS | AR/EN button calls `onLocaleChange` |
| 2.4 | `i18n.ts` has complete EN/AR label maps | PASS | 38 keys in both locales |
| 2.5 | Components use inline AR fallback | PASS | All 10 components have `locale === 'ar'` checks |
| 2.6 | SignalRail AR labels | PASS | "الإشارات" header |
| 2.7 | PropagationPanel AR labels | PASS | "سلسلة الانتشار", "الدول", "القطاعات" |
| 2.8 | ExecutiveBrief AR labels | PASS | "الملخص التنفيذي" |
| 2.9 | GlobeCanvas AR labels | PASS | "شبكة استخبارات الخليج", node labels in Arabic |
| 2.10 | DecisionRail AR labels | PASS | "قرار النظام", "درجة المخاطر", "الثقة", "التبرير" |

## 3. Demo Fallback

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 3.1 | `checkHealth()` pings `/api/health` with 3s timeout | PASS | `AbortSignal.timeout(3000)` |
| 3.2 | Failure → falls through to `getDemoPayload()` | PASS | `useIntelligence` catch block |
| 3.3 | 5 curated demo payloads present | PASS | oil_spike, fraud_surge, supply_chain_break, repair_cost_inflation, geopolitical_escalation |
| 3.4 | Demo payloads generated from real engine output | PASS | `demo-data.ts` sourced from `output/demo_payload_*.json` |
| 3.5 | `isDemo` flag set correctly | PASS | Controls amber DEMO MODE banner |
| 3.6 | Demo meta card displays title + headline | PASS | Cyan card below top bar in demo mode |
| 3.7 | ScenarioSwitcher lists all 5 scenarios | PASS | `listDemoScenarios()` maps DEMO_PAYLOADS entries |
| 3.8 | Scenario switching reloads payload | PASS | `useCallback` depends on `params.scenario` |
| 3.9 | VITE_API_BASE_URL empty = demo-only mode | PASS | `API_BASE` defaults to `""` → relative URL → fails → demo |
| 3.10 | Live mode auto-refresh every 15s | PASS | `setInterval(load, 15000)` when `params.live` |

## 4. GitHub-Facing Links & Placeholders

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 4.1 | GitHub repo URL consistent | PASS | `https://github.com/PyBADR/deevo-cortex` everywhere |
| 4.2 | Discord URL | REMOVED | All Discord references removed |
| 4.3 | Vercel deploy URL | PASS | `https://deevo-cortex.vercel.app` in README |
| 4.4 | License link | PASS | Points to `LICENSE` (MIT) |
| 4.5 | Author attribution | PASS | "Bader Alabddan" / "PyBADR" consistent |
| 4.6 | Version badge | PASS | `v2.0.0` in README and package.json |
| 4.7 | SECURITY.md contact email | PASS | `bader.marketing.39@gmail.com` |
| 4.8 | No TODO/FIXME/placeholder text in source | PASS | Checked all component files |

## 5. Landing Page Visual Hierarchy

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 5.1 | Hero headline `text-8xl` dominant | PASS | "See the risk. Before the market does." |
| 5.2 | Animated gradient background | PASS | `gradientShift` keyframes, 8s cycle |
| 5.3 | CTA buttons prominent | PASS | Cyan primary, two secondary border buttons |
| 5.4 | Pipeline flow section | PASS | 5-step horizontal flow with arrows |
| 5.5 | 3 capability cards | PASS | "Reads 8 Live Signals", "Builds Causal Graphs", "Makes Decisions" |
| 5.6 | Architecture strip | PASS | 7-layer text with monospace font |
| 5.7 | Footer with all links | PASS | GitHub, Docs, MIT License |
| 5.8 | Author credit | PASS | "by Bader Alabddan" below CTA, "Built by" in footer |

## 6. Command Center Visual Hierarchy

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 6.1 | TopCommandBar — fixed 48px header | PASS | DEEVO branding, decision badge, controls |
| 6.2 | Demo mode amber bar visible | PASS | Conditionally rendered when `isDemo` |
| 6.3 | 12-column grid layout | PASS | Row 1: 3+6+3, Row 2: 5+7, Row 3: 4+8 |
| 6.4 | SignalRail left column | PASS | Severity-sorted, sparklines, color-coded borders |
| 6.5 | GlobeCanvas center | PASS | SVG GCC network, 6 nodes, 8 edges, pulse animation |
| 6.6 | DecisionRail — HERO component | PASS | text-4xl decision, 40px+80px glow, text-5xl risk score |
| 6.7 | ExecutiveBrief — AI badge | PASS | Cyan left border accent, AI tag |
| 6.8 | PropagationPanel — chain visualization | PASS | Chevron arrows, weight %, countries/sectors tags |
| 6.9 | ScenarioSwitcher — active glow | PASS | Active scenario has cyan glow shadow |
| 6.10 | CountryCard — flag + GWP | PASS | Emoji flag, risk signature quote, key metric |
| 6.11 | LoadingState — DEEVO wordmark glow | PASS | Animated dots, cyan text-shadow |
| 6.12 | EmptyState — fallback message | PASS | Centered monospace message |

## 7. Build & Bundle

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 7.1 | TypeScript — zero errors | PASS | `tsc -b` clean |
| 7.2 | Vite production build | PASS | 5.93s build time |
| 7.3 | Bundle size acceptable | PASS | 365.90 KB JS (86.42 KB gzip), 20.31 KB CSS (4.63 KB gzip) |
| 7.4 | Entry HTML present | PASS | `dist/index.html` (0.99 KB) |
| 7.5 | No console errors in source | PASS | No console.log/warn/error in components |

## 8. Repository Files

| # | File | Present | Notes |
|---|------|---------|-------|
| 8.1 | README.md | YES | 101 lines, bold, decision-focused |
| 8.2 | LICENSE | YES | MIT License |
| 8.3 | CONTRIBUTING.md | YES | Standard open-source guide |
| 8.4 | SECURITY.md | YES | Report to bader.marketing.39@gmail.com |
| 8.5 | CODE_OF_CONDUCT.md | YES | Contributor Covenant |
| 8.6 | RELEASES.md | YES | Release history |
| 8.7 | CHANGELOG.md | YES | v2.0.0 release notes |
| 8.8 | SELF_HOSTING.md | YES | Docker, manual, Mac M4 Max + Ollama |

## 9. Vercel Deployment Config

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 9.1 | Root `vercel.json` — rootDirectory: "frontend" | PASS | Points Vercel to frontend/ |
| 9.2 | Frontend `vercel.json` — framework: "vite" | PASS | Correct framework detection |
| 9.3 | SPA rewrites — `/(.*) → /index.html` | PASS | Both root and frontend configs |
| 9.4 | Output directory — `dist` | PASS | Matches Vite default |
| 9.5 | Security headers | PASS | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection |
| 9.6 | `VITE_API_BASE_URL` env var documented | PASS | `.env.example` in frontend/ |

---

## Pre-Launch Action Items

- [ ] Verify GitHub repo is set to Public
- [ ] Add repository description: "AI decision intelligence for GCC insurance markets"
- [ ] Add topics: `ai`, `insurance`, `gcc`, `decision-intelligence`, `risk-analysis`, `causal-graph`
- [ ] Deploy to Vercel and verify live URL
- [ ] Test demo mode on production URL (no backend = should work)
- [ ] Add social preview image (Open Graph) to repository

---

**VERDICT: LAUNCH READY**

All critical checks pass. Frontend deploys as-is with zero backend dependency. Demo mode provides full product experience from 5 curated real-engine scenarios.
