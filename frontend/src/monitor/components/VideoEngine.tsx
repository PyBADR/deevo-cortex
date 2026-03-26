// ============================================================================
// DEEVO Monitor — Scenario Video Engine Component
// Preview, export, and batch-generate cinematic scenario videos.
// Uses HTML5 Canvas + MediaRecorder for in-browser video production.
// ============================================================================

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  SCENARIO_VIDEOS,
  getVideoConfig,
  createParticles,
  renderFrame,
  getSupportedMimeType,
  getFileExtension,
} from '../engine/video';
import type { VideoFormat, Particle, ScenarioVideoData, VideoConfig } from '../engine/video';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  isLive: boolean;
}

interface DownloadItem {
  id: string;
  label: string;
  url: string;
  filename: string;
  format: VideoFormat;
  size: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VideoEngine({ isLive }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [format, setFormat] = useState<VideoFormat>('vertical');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBatchExporting, setIsBatchExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [batchLabel, setBatchLabel] = useState('');
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const previewRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef(0);

  const scenario = SCENARIO_VIDEOS[selectedIdx];
  const config = getVideoConfig(format);

  // Preview dimensions (scaled to fit UI)
  const maxPreviewH = 380;
  const previewScale = maxPreviewH / config.height;
  const previewW = Math.round(config.width * previewScale);
  const previewH = Math.round(config.height * previewScale);

  // ---- Preview Playback ----

  const stopPreview = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = 0;
    setIsPlaying(false);
  }, []);

  const startPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;
    stopPreview();

    canvas.width = previewW;
    canvas.height = previewH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    particlesRef.current = createParticles(60, previewW, previewH);
    startTimeRef.current = performance.now();
    setIsPlaying(true);

    const scaledConfig: VideoConfig = { ...config, width: previewW, height: previewH };

    function frame() {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      if (elapsed >= config.duration) {
        setIsPlaying(false);
        return;
      }
      renderFrame(ctx!, elapsed, scenario, scaledConfig, particlesRef.current);
      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
  }, [scenario, config, previewW, previewH, stopPreview]);

  // Cleanup on unmount
  useEffect(() => () => stopPreview(), [stopPreview]);

  // Auto-preview on scenario/format change
  useEffect(() => {
    startPreview();
  }, [selectedIdx, format]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Single Export ----

  const exportVideo = useCallback(async (
    scn: ScenarioVideoData, fmt: VideoFormat,
  ): Promise<DownloadItem | null> => {
    const cfg = getVideoConfig(fmt);
    const offscreen = document.createElement('canvas');
    offscreen.width = cfg.width;
    offscreen.height = cfg.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return null;

    const particles = createParticles(120, cfg.width, cfg.height);
    const mime = getSupportedMimeType();
    const ext = getFileExtension(mime);
    const stream = offscreen.captureStream(cfg.fps);
    const recorder = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: 8_000_000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    return new Promise<DownloadItem | null>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        const url = URL.createObjectURL(blob);
        const filename = `deevo_${scn.id}_${fmt}.${ext}`;
        resolve({
          id: `${scn.id}_${fmt}`,
          label: `${scn.hookText} (${fmt})`,
          url,
          filename,
          format: fmt,
          size: blob.size,
        });
      };

      recorder.start();
      const t0 = performance.now();

      function render() {
        const elapsed = (performance.now() - t0) / 1000;
        const pct = Math.min(elapsed / cfg.duration, 1);
        setExportProgress(pct);

        if (elapsed >= cfg.duration) {
          // Render final frame
          renderFrame(ctx!, cfg.duration - 0.001, scn, cfg, particles);
          recorder.stop();
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        renderFrame(ctx!, elapsed, scn, cfg, particles);
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (isExporting || isBatchExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    const item = await exportVideo(scenario, format);
    if (item) setDownloads(prev => [item, ...prev.filter(d => d.id !== item.id)]);
    setIsExporting(false);
  }, [scenario, format, isExporting, isBatchExporting, exportVideo]);

  // ---- Batch Export (all 5 × both formats = 10 videos) ----

  const handleBatchExport = useCallback(async () => {
    if (isExporting || isBatchExporting) return;
    setIsBatchExporting(true);
    const results: DownloadItem[] = [];
    const formats: VideoFormat[] = ['vertical', 'horizontal'];

    for (let si = 0; si < SCENARIO_VIDEOS.length; si++) {
      for (const fmt of formats) {
        const scn = SCENARIO_VIDEOS[si];
        setBatchLabel(`${scn.hookText} — ${fmt}`);
        setExportProgress(0);
        const item = await exportVideo(scn, fmt);
        if (item) results.push(item);
      }
    }

    setDownloads(results);
    setIsBatchExporting(false);
    setBatchLabel('');
  }, [isExporting, isBatchExporting, exportVideo]);

  // ---- Format size display ----
  const fmtSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // ---- Render ----

  const busy = isExporting || isBatchExporting;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-deevo-border/20">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400 tracking-wider font-bold">
            SCENARIO VIDEO ENGINE
          </span>
          <span className="text-[9px] font-mono text-deevo-muted">
            {config.width}×{config.height} · {config.fps}fps · {config.duration}s
          </span>
        </div>

        {/* Format toggle */}
        <div className="flex items-center gap-1">
          {(['vertical', 'horizontal'] as VideoFormat[]).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider transition-all ${
                format === f
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-deevo-muted hover:text-deevo-text border border-deevo-border/30'
              }`}
            >
              {f === 'vertical' ? '9:16' : '16:9'}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Preview + controls */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 gap-3">
          {/* Canvas preview */}
          <div
            className="relative border border-deevo-border/30 rounded-lg overflow-hidden bg-deevo-bg"
            style={{ width: previewW, height: previewH }}
          >
            <canvas ref={previewRef} className="w-full h-full" />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  onClick={startPreview}
                  className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40
                    flex items-center justify-center hover:bg-amber-500/30 transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 ml-0.5" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Scenario selector */}
          <div className="flex gap-1 flex-wrap justify-center">
            {SCENARIO_VIDEOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedIdx(i)}
                className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider transition-all ${
                  selectedIdx === i
                    ? 'text-white border'
                    : 'text-deevo-muted hover:text-deevo-text border border-deevo-border/30'
                }`}
                style={selectedIdx === i ? {
                  backgroundColor: s.accent + '20',
                  borderColor: s.accent + '50',
                  color: s.accent,
                } : undefined}
              >
                {s.id.replace(/_/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={startPreview}
              disabled={busy}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-wider
                bg-deevo-surface border border-deevo-border/30 text-deevo-text
                hover:border-cyan-500/30 hover:text-cyan-400 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ▶ PREVIEW
            </button>
            <button
              onClick={handleExport}
              disabled={busy}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-wider
                bg-amber-500/10 border border-amber-500/30 text-amber-400
                hover:bg-amber-500/20 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ⬇ EXPORT {format === 'vertical' ? '9:16' : '16:9'}
            </button>
            <button
              onClick={handleBatchExport}
              disabled={busy}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-wider
                bg-violet-500/10 border border-violet-500/30 text-violet-400
                hover:bg-violet-500/20 transition-all
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ⬇ EXPORT ALL (10)
            </button>
          </div>

          {/* Progress bar */}
          {busy && (
            <div className="w-full max-w-md">
              {batchLabel && (
                <div className="text-[9px] font-mono text-deevo-muted mb-1 text-center truncate">
                  {batchLabel}
                </div>
              )}
              <div className="h-1.5 bg-deevo-surface rounded-full overflow-hidden border border-deevo-border/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-200"
                  style={{ width: `${exportProgress * 100}%` }}
                />
              </div>
              <div className="text-[9px] font-mono text-amber-400/60 mt-0.5 text-center">
                {isExporting ? 'RECORDING...' : `BATCH ${Math.round(exportProgress * 100)}%`}
                {' · '}
                {Math.round(exportProgress * config.duration)}s / {config.duration}s
              </div>
            </div>
          )}
        </div>

        {/* Right: Downloads panel */}
        <div className="w-64 flex-shrink-0 border-l border-deevo-border/20 p-3 overflow-y-auto">
          <div className="text-[10px] font-mono text-deevo-muted tracking-wider mb-2">
            EXPORTS ({downloads.length})
          </div>

          {downloads.length === 0 && !busy && (
            <div className="text-[10px] text-deevo-muted/50 font-mono text-center py-8">
              No videos exported yet.<br />
              Click EXPORT to generate.
            </div>
          )}

          <div className="space-y-1.5">
            {downloads.map(dl => (
              <div
                key={dl.id}
                className="p-2 rounded border border-deevo-border/20 bg-deevo-surface/50
                  hover:border-amber-500/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-mono text-deevo-text truncate">
                      {dl.filename}
                    </div>
                    <div className="text-[8px] font-mono text-deevo-muted mt-0.5">
                      {fmtSize(dl.size)} · {dl.format === 'vertical' ? '9:16' : '16:9'}
                    </div>
                  </div>
                  <a
                    href={dl.url}
                    download={dl.filename}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono
                      bg-amber-500/10 text-amber-400 border border-amber-500/20
                      hover:bg-amber-500/20 transition-all flex-shrink-0"
                  >
                    ⬇
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Info section */}
          <div className="mt-4 p-2 rounded border border-deevo-border/10 bg-deevo-bg/50">
            <div className="text-[9px] font-mono text-deevo-muted space-y-1">
              <div className="text-amber-400/60 font-bold tracking-wider mb-1">VIDEO SPECS</div>
              <div>Format: {getSupportedMimeType()}</div>
              <div>Vertical: 1080×1920 (IG/TikTok)</div>
              <div>Horizontal: 1920×1080 (LinkedIn)</div>
              <div>Bitrate: 8 Mbps</div>
              <div>Duration: 15s per video</div>
              <div>Scenarios: {SCENARIO_VIDEOS.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
