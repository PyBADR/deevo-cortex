import type { CommandCenterPayload } from "../types/ui";
import { DEMO_PAYLOADS } from "./demo-data";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || "";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchCommandCenter(input?: {
  signals?: Record<string, number>;
  country_id?: string;
  locale?: "en" | "ar";
}): Promise<CommandCenterPayload> {
  const url = API_BASE ? `${API_BASE}/api/intelligence/ui` : `/api/intelligence/ui`;
  return parseJson(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input ?? {}),
    })
  );
}

export async function checkHealth(): Promise<boolean> {
  try {
    const url = API_BASE ? `${API_BASE}/api/health` : `/api/health`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export function getDemoPayload(scenario: string): CommandCenterPayload {
  const demo = DEMO_PAYLOADS[scenario] || DEMO_PAYLOADS["oil_spike"];
  return demo.ui_payload;
}

export function getDemoMeta(scenario: string) {
  const demo = DEMO_PAYLOADS[scenario] || DEMO_PAYLOADS["oil_spike"];
  return { meta: demo.demo_meta, country_card: demo.country_card };
}

export function listDemoScenarios() {
  return Object.entries(DEMO_PAYLOADS).map(([id, d]) => ({
    id,
    title: d.demo_meta.title,
    expected_decision: d.demo_meta.expected_decision,
    country_focus: d.demo_meta.country_focus,
  }));
}
