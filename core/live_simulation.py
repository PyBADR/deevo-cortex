"""DEEVO Cortex — Live Simulation Mode

Lightweight signal perturbation engine that simulates real-time
market data feeds. Adds small, bounded random variations to each
signal on every tick, creating a "living" data stream.

Design constraints:
  - Deterministic when seeded (reproducible demos)
  - Bounded drift — signals stay within realistic ranges
  - Zero external dependencies (stdlib random only)
  - Fast — sub-millisecond per tick

Phase 4 — Live Intelligence Layer
"""

import random
import time
from copy import deepcopy
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Signal bounds and volatility profiles
# ---------------------------------------------------------------------------

SIGNAL_PROFILES = {
    "oil_price": {
        "min": 40.0, "max": 180.0,
        "volatility": 3.0,       # max delta per tick in absolute units
        "trend_bias": 0.0,       # neutral
    },
    "inflation": {
        "min": 0.5, "max": 10.0,
        "volatility": 0.15,
        "trend_bias": 0.0,
    },
    "claims_rate": {
        "min": 0.10, "max": 0.95,
        "volatility": 0.02,
        "trend_bias": 0.0,
    },
    "fraud_index": {
        "min": 0.05, "max": 0.95,
        "volatility": 0.03,
        "trend_bias": 0.0,
    },
    "repair_cost_index": {
        "min": 0.5, "max": 2.5,
        "volatility": 0.04,
        "trend_bias": 0.0,
    },
    "interest_rate": {
        "min": 1.0, "max": 12.0,
        "volatility": 0.10,
        "trend_bias": 0.0,
    },
    "supply_chain_stress": {
        "min": 0.05, "max": 1.0,
        "volatility": 0.03,
        "trend_bias": 0.0,
    },
    "currency_volatility": {
        "min": 0.01, "max": 0.30,
        "volatility": 0.01,
        "trend_bias": 0.0,
    },
}


# ---------------------------------------------------------------------------
# Perturbation engine
# ---------------------------------------------------------------------------

class LiveSimulator:
    """Stateful signal perturbation engine.

    Usage:
        sim = LiveSimulator(base_signals, seed=42)
        for _ in range(10):
            signals = sim.tick()
            # feed signals into unified_engine.run(signals=signals)
    """

    def __init__(
        self,
        base_signals: dict,
        seed: Optional[int] = None,
        trend_bias: Optional[Dict[str, float]] = None,
    ):
        """
        Args:
            base_signals: Starting signal values.
            seed: Random seed for reproducibility. None = non-deterministic.
            trend_bias: Optional {signal_key: bias} to simulate directional
                        trends (positive = upward drift, negative = downward).
        """
        self._rng = random.Random(seed)
        self._current = deepcopy(base_signals)
        self._tick_count = 0
        self._history: List[dict] = []
        self._trend_bias = trend_bias or {}

    @property
    def tick_count(self) -> int:
        return self._tick_count

    @property
    def current_signals(self) -> dict:
        return deepcopy(self._current)

    @property
    def history(self) -> List[dict]:
        return list(self._history)

    def tick(self) -> dict:
        """Advance one time step. Returns new signal dict.

        Each numeric signal is perturbed by a bounded random delta:
            delta = volatility * uniform(-1, 1) + trend_bias
            new_value = clamp(current + delta, min, max)
        """
        self._tick_count += 1
        ts = datetime.now(timezone.utc).isoformat()
        previous = deepcopy(self._current)

        for key, value in self._current.items():
            if not isinstance(value, (int, float)):
                continue
            profile = SIGNAL_PROFILES.get(key)
            if profile is None:
                continue

            volatility = profile["volatility"]
            bias = self._trend_bias.get(key, profile.get("trend_bias", 0.0))

            delta = volatility * self._rng.uniform(-1.0, 1.0) + bias
            new_val = value + delta
            new_val = max(profile["min"], min(profile["max"], new_val))
            self._current[key] = round(new_val, 4)

        # Stamp the tick
        self._current["timestamp"] = ts

        self._history.append({
            "tick": self._tick_count,
            "timestamp": ts,
            "signals": deepcopy(self._current),
            "previous": previous,
        })

        return deepcopy(self._current)

    def tick_n(self, n: int) -> List[dict]:
        """Advance N ticks and return list of signal snapshots."""
        return [self.tick() for _ in range(n)]

    def reset(self, base_signals: dict) -> None:
        """Reset simulator to new base signals."""
        self._current = deepcopy(base_signals)
        self._tick_count = 0
        self._history.clear()


# ---------------------------------------------------------------------------
# Convenience: single-shot perturbation
# ---------------------------------------------------------------------------

def perturb_signals(
    signals: dict,
    intensity: float = 1.0,
    seed: Optional[int] = None,
) -> dict:
    """Apply a single random perturbation to signals.

    Args:
        signals: Base signal values.
        intensity: Multiplier on volatility (0.5 = half noise, 2.0 = double).
        seed: Random seed for reproducibility.

    Returns:
        New signal dict with perturbed values.
    """
    rng = random.Random(seed)
    result = deepcopy(signals)

    for key, value in result.items():
        if not isinstance(value, (int, float)):
            continue
        profile = SIGNAL_PROFILES.get(key)
        if profile is None:
            continue

        volatility = profile["volatility"] * intensity
        delta = volatility * rng.uniform(-1.0, 1.0)
        new_val = value + delta
        new_val = max(profile["min"], min(profile["max"], new_val))
        result[key] = round(new_val, 4)

    result["timestamp"] = datetime.now(timezone.utc).isoformat()
    return result


# ---------------------------------------------------------------------------
# Scenario injection
# ---------------------------------------------------------------------------

def inject_scenario_drift(
    base_signals: dict,
    scenario: str,
    steps: int = 10,
    seed: Optional[int] = None,
) -> List[dict]:
    """Simulate a gradual scenario onset over N steps.

    Applies a directional trend bias aligned with the named scenario,
    producing a realistic signal trajectory.

    Args:
        base_signals: Starting signal state.
        scenario: One of 'oil_spike', 'fraud_surge', 'repair_cost_inflation'.
        steps: Number of ticks to simulate.
        seed: Random seed.

    Returns:
        List of signal dicts showing scenario progression.
    """
    SCENARIO_BIASES = {
        "oil_spike": {
            "oil_price": 2.5,
            "inflation": 0.08,
            "supply_chain_stress": 0.02,
            "repair_cost_index": 0.02,
        },
        "fraud_surge": {
            "fraud_index": 0.04,
            "claims_rate": 0.01,
        },
        "repair_cost_inflation": {
            "repair_cost_index": 0.05,
            "inflation": 0.05,
            "claims_rate": 0.01,
            "supply_chain_stress": 0.015,
        },
    }

    bias = SCENARIO_BIASES.get(scenario, {})
    sim = LiveSimulator(base_signals, seed=seed, trend_bias=bias)
    return sim.tick_n(steps)
