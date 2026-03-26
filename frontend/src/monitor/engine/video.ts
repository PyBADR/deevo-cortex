// ============================================================================
// DEEVO Monitor — Scenario Video Rendering Engine
// Renders cinematic scenario videos using HTML5 Canvas.
// Supports vertical (1080×1920) and horizontal (1920×1080) formats.
// 5 scenarios × 4 scenes: Hook → Chain → Decision → Branding
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VideoFormat = 'vertical' | 'horizontal';

export interface VideoConfig {
  format: VideoFormat;
  width: number;
  height: number;
  fps: number;
  duration: number; // seconds
}

export interface ChainNode {
  label: string;
  value: string;
  color: string;
}

export interface ScenarioVideoData {
  id: string;
  hookText: string;
  hookSub: string;
  chain: ChainNode[];
  decision: string;
  severity: 'critical' | 'high' | 'medium';
  accent: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

// ---------------------------------------------------------------------------
// Format Configs
// ---------------------------------------------------------------------------

export const FORMAT_CONFIGS: Record<VideoFormat, Omit<VideoConfig, 'format'>> = {
  vertical:   { width: 1080, height: 1920, fps: 30, duration: 15 },
  horizontal: { width: 1920, height: 1080, fps: 30, duration: 15 },
};

export function getVideoConfig(format: VideoFormat): VideoConfig {
  return { format, ...FORMAT_CONFIGS[format] };
}

// ---------------------------------------------------------------------------
// 5 Scenario Definitions
// ---------------------------------------------------------------------------

export const SCENARIO_VIDEOS: ScenarioVideoData[] = [
  {
    id: 'oil_spike',
    hookText: 'OIL SPIKE DETECTED',
    hookSub: 'Brent crude surges past critical threshold',
    chain: [
      { label: 'OIL PRICE',   value: '+18.4%', color: '#f59e0b' },
      { label: 'INFLATION',   value: '+6.2%',  color: '#ef4444' },
      { label: 'CLAIMS COST', value: '+22%',   color: '#06b6d4' },
      { label: 'FRAUD RISK',  value: 'HIGH',   color: '#f43f5e' },
    ],
    decision: 'ESCALATE',
    severity: 'critical',
    accent: '#f59e0b',
  },
  {
    id: 'fraud_ring',
    hookText: 'FRAUD RING DETECTED',
    hookSub: 'Cross-border claims network identified',
    chain: [
      { label: 'FRAUD ACTIVITY', value: '↑ SURGE', color: '#f43f5e' },
      { label: 'CLAIMS SPIKE',   value: '+30%',    color: '#06b6d4' },
      { label: 'INVESTIGATION',  value: 'ACTIVE',  color: '#8b5cf6' },
      { label: 'REGULATORY',     value: 'ALERT',   color: '#3b82f6' },
    ],
    decision: 'ESCALATE',
    severity: 'critical',
    accent: '#f43f5e',
  },
  {
    id: 'supply_disruption',
    hookText: 'SUPPLY DISRUPTION',
    hookSub: 'Critical logistics corridor compromised',
    chain: [
      { label: 'SUPPLY CHAIN',   value: '-18%',  color: '#8b5cf6' },
      { label: 'REPAIR COSTS',   value: '+25%',  color: '#f59e0b' },
      { label: 'CLAIMS BACKLOG', value: '+40%',  color: '#06b6d4' },
      { label: 'MARKET IMPACT',  value: 'HIGH',  color: '#ef4444' },
    ],
    decision: 'FLAG',
    severity: 'high',
    accent: '#8b5cf6',
  },
  {
    id: 'compound_crisis',
    hookText: 'COMPOUND CRISIS',
    hookSub: 'Multiple risk vectors converging simultaneously',
    chain: [
      { label: 'OIL SHOCK',    value: '+12%',  color: '#f59e0b' },
      { label: 'SUPPLY FAIL',  value: '-18%',  color: '#8b5cf6' },
      { label: 'CLAIMS SURGE', value: '+35%',  color: '#06b6d4' },
      { label: 'FRAUD SPIKE',  value: '+40%',  color: '#f43f5e' },
      { label: 'SOLVENCY',     value: 'RISK',  color: '#ef4444' },
    ],
    decision: 'ESCALATE',
    severity: 'critical',
    accent: '#dc2626',
  },
  {
    id: 'regulatory_wave',
    hookText: 'REGULATORY WAVE',
    hookSub: 'New GCC compliance framework approaching',
    chain: [
      { label: 'IFRS 17',      value: 'UPDATE',  color: '#3b82f6' },
      { label: 'CAPITAL REQ',  value: '+15%',    color: '#f59e0b' },
      { label: 'RESERVES',     value: 'ADJUST',  color: '#06b6d4' },
      { label: 'PORTFOLIO',    value: 'REVIEW',  color: '#22c55e' },
    ],
    decision: 'REVIEW',
    severity: 'medium',
    accent: '#3b82f6',
  },
];

// ---------------------------------------------------------------------------
// Scene Timing (seconds)
// ---------------------------------------------------------------------------

const SCENES = {
  hook:     { start: 0,    end: 2.5  },
  chain:    { start: 2.5,  end: 10.5 },
  decision: { start: 10.5, end: 13.0 },
  brand:    { start: 13.0, end: 15.0 },
};

// ---------------------------------------------------------------------------
// Particle System
// ---------------------------------------------------------------------------

export function createParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -Math.random() * 0.5 - 0.1,
    size: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.25 + 0.05,
  }));
}

function updateParticles(ps: Particle[], w: number, h: number): void {
  for (const p of ps) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10)  { p.y = h + 10; p.x = Math.random() * w; }
    if (p.x < -10)  p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
  }
}

// ---------------------------------------------------------------------------
// Math Helpers
// ---------------------------------------------------------------------------

function easeOut(t: number): number    { return 1 - (1 - t) ** 3; }
function easeInOut(t: number): number  { return t < 0.5 ? 4*t*t*t : 1 - (-2*t + 2)**3 / 2; }
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function clamp01(t: number): number    { return Math.max(0, Math.min(1, t)); }

// ---------------------------------------------------------------------------
// Drawing Helpers
// ---------------------------------------------------------------------------

function glowText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  color: string, size: number, blur = 20,
) {
  ctx.save();
  ctx.font = `800 ${size}px "Inter","Segoe UI",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Outer glow
  ctx.shadowColor = color;
  ctx.shadowBlur = blur * 1.5;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.fillText(text, x, y);

  // Inner glow
  ctx.shadowBlur = blur;
  ctx.globalAlpha = 0.65;
  ctx.fillText(text, x, y);

  // Sharp text
  ctx.shadowBlur = blur * 0.4;
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 1;
  ctx.fillText(text, x, y);

  ctx.restore();
}

function subText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  size: number, alpha = 1,
) {
  ctx.save();
  ctx.font = `400 ${size}px "Inter","Segoe UI",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(148,163,184,${alpha})`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function monoText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  color: string, size: number, alpha = 1,
) {
  ctx.save();
  ctx.font = `600 ${size}px "JetBrains Mono","Fira Code",monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// Background Layer
// ---------------------------------------------------------------------------

function renderBackground(
  ctx: CanvasRenderingContext2D, time: number,
  w: number, h: number, accent: string, particles: Particle[],
) {
  // Solid dark base
  ctx.fillStyle = '#1F232A';
  ctx.fillRect(0, 0, w, h);

  // Accent radial glow (very subtle)
  const grd = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.6);
  grd.addColorStop(0, accent + '15');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  // Particles
  updateParticles(particles, w, h);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(6,182,212,${p.alpha})`;
    ctx.fill();
  }
}

function renderScanlines(ctx: CanvasRenderingContext2D, time: number, w: number, h: number) {
  ctx.save();
  // Static scanlines
  ctx.globalAlpha = 0.025;
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, y, w, 1);
  }
  // Moving scan beam
  const scanY = ((time * 80) % (h + 100)) - 50;
  const sg = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
  sg.addColorStop(0, 'transparent');
  sg.addColorStop(0.5, 'rgba(6,182,212,0.06)');
  sg.addColorStop(1, 'transparent');
  ctx.globalAlpha = 1;
  ctx.fillStyle = sg;
  ctx.fillRect(0, scanY - 40, w, 80);
  ctx.restore();
}

function renderVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grd = ctx.createRadialGradient(
    w/2, h/2, Math.min(w, h) * 0.3,
    w/2, h/2, Math.max(w, h) * 0.7,
  );
  grd.addColorStop(0, 'transparent');
  grd.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

function renderTopBar(
  ctx: CanvasRenderingContext2D, time: number,
  scenario: ScenarioVideoData, config: VideoConfig,
) {
  const { width: w, height: h } = config;
  const barH = h * 0.038;
  const alpha = clamp01(time / 0.5);

  ctx.save();
  ctx.globalAlpha = alpha * 0.85;
  ctx.fillStyle = 'rgba(5,7,11,0.92)';
  ctx.fillRect(0, 0, w, barH);

  const fs = barH * 0.42;

  // Left: DEEVO
  ctx.font = `700 ${fs}px "Inter",sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText('DEEVO', w * 0.03, barH / 2);

  // Right: LIVE dot + label
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(w * 0.955, barH / 2, fs * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `600 ${fs * 0.75}px "JetBrains Mono",monospace`;
  ctx.fillText('LIVE', w * 0.945, barH / 2);

  // Bottom border glow
  ctx.strokeStyle = scenario.accent + '40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, barH);
  ctx.lineTo(w, barH);
  ctx.stroke();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 1 — HOOK (0 → 2.5 s)
// ---------------------------------------------------------------------------

function renderHook(
  ctx: CanvasRenderingContext2D, time: number,
  scenario: ScenarioVideoData, config: VideoConfig,
) {
  const { width: w, height: h } = config;
  const isV = config.format === 'vertical';

  const textIn = easeOut(clamp01(time / 0.8));
  const scale  = lerp(0.75, 1, textIn);
  const alpha  = clamp01(time / 0.5);
  const fadeO  = time > 1.8 ? clamp01((SCENES.hook.end - time) / 0.7) : 1;

  ctx.save();
  ctx.globalAlpha = alpha * fadeO;
  ctx.translate(w / 2, h * 0.42);
  ctx.scale(scale, scale);

  const hookS = isV ? h * 0.034 : h * 0.06;
  glowText(ctx, scenario.hookText, 0, 0, scenario.accent, hookS, hookS * 0.5);

  // Subtext fade-in
  const subA = clamp01((time - 0.4) / 0.5) * fadeO;
  subText(ctx, scenario.hookSub, 0, hookS * 1.6, hookS * 0.32, subA);

  // Accent line
  const lineW = w * 0.4 * easeOut(clamp01((time - 0.2) / 0.6));
  ctx.strokeStyle = scenario.accent;
  ctx.globalAlpha = 0.45 * fadeO;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-lineW / 2, hookS * 0.7);
  ctx.lineTo(lineW / 2, hookS * 0.7);
  ctx.stroke();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 2 — CHAIN (2.5 → 10.5 s)
// ---------------------------------------------------------------------------

function renderChain(
  ctx: CanvasRenderingContext2D, t: number, // 0-1 normalized
  scenario: ScenarioVideoData, config: VideoConfig,
) {
  const { width: w, height: h } = config;
  const isV = config.format === 'vertical';
  const nodes = scenario.chain;
  const count = nodes.length;

  const fadeIn = easeOut(clamp01(t * 5));
  ctx.save();
  ctx.globalAlpha = fadeIn;

  // Compute positions
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const frac = (i + 0.5) / count;
    if (isV) {
      positions.push({ x: w * 0.5, y: h * (0.18 + frac * 0.58) });
    } else {
      positions.push({ x: w * (0.1 + frac * 0.72), y: h * 0.5 });
    }
  }

  const actDur = 0.18; // each node activation takes this fraction of total

  for (let i = 0; i < count; i++) {
    const actStart = 0.06 + (i / count) * 0.7;
    const np = clamp01((t - actStart) / actDur);
    const active = np > 0;
    const pos = positions[i];

    const baseR = isV ? h * 0.032 : h * 0.055;
    const r = baseR * (active ? lerp(0.8, 1, easeOut(np)) : 0.8);

    // Connection to next node
    if (i < count - 1) {
      const lineStart = actStart + actDur * 0.4;
      const lp = easeInOut(clamp01((t - lineStart) / (actDur * 0.9)));
      if (lp > 0) {
        const next = positions[i + 1];
        const ex = lerp(pos.x, next.x, lp);
        const ey = lerp(pos.y, next.y, lp);

        // Line
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = nodes[i].color + '50';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Leading particle
        if (lp < 1) {
          ctx.save();
          ctx.shadowColor = nodes[i].color;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = nodes[i].color;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);

    if (active) {
      ctx.fillStyle = nodes[i].color + '20';
      ctx.strokeStyle = nodes[i].color;
      ctx.lineWidth = 2.5;
      ctx.save();
      ctx.shadowColor = nodes[i].color;
      ctx.shadowBlur = 22 * easeOut(np);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(15,23,42,0.7)';
      ctx.strokeStyle = 'rgba(100,116,139,0.25)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    }

    // Label (above node)
    const labelA = active ? easeOut(clamp01((np - 0.15) / 0.4)) : 0.25;
    const labelS = isV ? h * 0.013 : h * 0.022;
    monoText(ctx, nodes[i].label, pos.x, pos.y - r - labelS * 1.8,
      active ? '#e2e8f0' : '#475569', labelS, labelA);

    // Value (inside node when active)
    if (active && np > 0.35) {
      const valA = easeOut(clamp01((np - 0.35) / 0.4));
      const valS = isV ? h * 0.016 : h * 0.028;
      ctx.save();
      ctx.globalAlpha = valA;
      glowText(ctx, nodes[i].value, pos.x, pos.y, nodes[i].color, valS, 10);
      ctx.restore();
    }
  }

  // "CAUSAL CHAIN" header
  const hdrA = easeOut(clamp01(t * 4)) * (t > 0.85 ? clamp01((1 - t) / 0.15) : 1);
  const hdrS = isV ? h * 0.011 : h * 0.018;
  monoText(ctx, '── CAUSAL CHAIN ──', w / 2, h * (isV ? 0.12 : 0.14), '#64748b', hdrS, hdrA * 0.5);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 3 — DECISION (10.5 → 13 s)
// ---------------------------------------------------------------------------

function renderDecision(
  ctx: CanvasRenderingContext2D, t: number,
  scenario: ScenarioVideoData, config: VideoConfig,
) {
  const { width: w, height: h } = config;
  const isV = config.format === 'vertical';

  const slideUp = easeOut(clamp01(t / 0.3));
  const offset  = lerp(h * 0.08, 0, slideUp);
  const alpha   = clamp01(t / 0.25);

  const sevColor = scenario.severity === 'critical' ? '#ef4444'
    : scenario.severity === 'high' ? '#f59e0b' : '#06b6d4';

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(0, offset);

  const cy = h * 0.45;
  const bW = isV ? w * 0.55 : w * 0.28;
  const bH = isV ? h * 0.055 : h * 0.1;
  const bX = (w - bW) / 2;
  const bY = cy - bH / 2;
  const cr = bH * 0.22;

  // Badge
  ctx.save();
  ctx.shadowColor = sevColor;
  ctx.shadowBlur = 30;
  ctx.fillStyle = sevColor + '18';
  ctx.strokeStyle = sevColor;
  ctx.lineWidth = 2;
  roundedRect(ctx, bX, bY, bW, bH, cr);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Decision text
  const decS = isV ? h * 0.026 : h * 0.048;
  glowText(ctx, scenario.decision, w / 2, cy, sevColor, decS, 16);

  // "AI DECISION" label
  const lblS = isV ? h * 0.011 : h * 0.019;
  monoText(ctx, 'AI DECISION', w / 2, cy - bH * 0.85, '#94a3b8', lblS, 0.6);

  // Severity tag
  monoText(ctx, `SEVERITY: ${scenario.severity.toUpperCase()}`, w / 2, cy + bH * 0.85,
    sevColor, lblS * 0.85, 0.7);

  // Pulse rings
  if (t > 0.3) {
    const ring = ((t - 0.3) * 1.8) % 1;
    const rr = bH * 0.6 + ring * bH * 0.8;
    ctx.beginPath();
    ctx.arc(w / 2, cy, rr, 0, Math.PI * 2);
    ctx.strokeStyle = sevColor;
    ctx.globalAlpha = (1 - ring) * 0.25;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Scene 4 — BRANDING (13 → 15 s)
// ---------------------------------------------------------------------------

function renderBranding(
  ctx: CanvasRenderingContext2D, t: number, config: VideoConfig,
) {
  const { width: w, height: h } = config;
  const isV = config.format === 'vertical';

  const fadeIn  = easeOut(clamp01(t / 0.35));
  const fadeOut = t > 0.7 ? clamp01((1 - t) / 0.3) : 1;
  const a = fadeIn * fadeOut;

  ctx.save();
  ctx.globalAlpha = a;

  const logoS = isV ? h * 0.042 : h * 0.075;
  glowText(ctx, 'DEEVO', w / 2, h * 0.44, '#06b6d4', logoS, logoS * 0.6);

  const tagS = isV ? h * 0.013 : h * 0.023;
  subText(ctx, 'Decision Intelligence', w / 2, h * 0.44 + logoS * 1.3, tagS, a * 0.7);

  // Decorative line
  const lw = w * 0.18 * easeOut(clamp01((t - 0.08) / 0.35));
  ctx.strokeStyle = '#06b6d4';
  ctx.globalAlpha = 0.35 * fadeOut;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w / 2 - lw, h * 0.44 + logoS * 0.6);
  ctx.lineTo(w / 2 + lw, h * 0.44 + logoS * 0.6);
  ctx.stroke();

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Main Frame Renderer — called once per frame
// ---------------------------------------------------------------------------

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  time: number,
  scenario: ScenarioVideoData,
  config: VideoConfig,
  particles: Particle[],
): void {
  const { width: w, height: h } = config;

  // 1. Background + particles
  renderBackground(ctx, time, w, h, scenario.accent, particles);

  // 2. Scanlines overlay
  renderScanlines(ctx, time, w, h);

  // 3. Scene content (can overlap during transitions)
  if (time < SCENES.hook.end) {
    renderHook(ctx, time, scenario, config);
  }
  if (time >= SCENES.chain.start && time < SCENES.chain.end) {
    const t = (time - SCENES.chain.start) / (SCENES.chain.end - SCENES.chain.start);
    renderChain(ctx, t, scenario, config);
  }
  if (time >= SCENES.decision.start && time < SCENES.decision.end) {
    const t = (time - SCENES.decision.start) / (SCENES.decision.end - SCENES.decision.start);
    renderDecision(ctx, t, scenario, config);
  }
  if (time >= SCENES.brand.start) {
    const t = (time - SCENES.brand.start) / (SCENES.brand.end - SCENES.brand.start);
    renderBranding(ctx, t, config);
  }

  // 4. Vignette
  renderVignette(ctx, w, h);

  // 5. Persistent top bar
  renderTopBar(ctx, time, scenario, config);
}

// ---------------------------------------------------------------------------
// Supported MIME type detection
// ---------------------------------------------------------------------------

export function getSupportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return 'video/webm';
  const types = [
    'video/mp4;codecs=avc1.42E01E',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'video/webm';
}

export function getFileExtension(mime: string): string {
  return mime.startsWith('video/mp4') ? 'mp4' : 'webm';
}
