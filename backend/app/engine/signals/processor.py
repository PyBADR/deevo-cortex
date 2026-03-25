"""
DEEVO Cortex - Signal Processor
Core signal ingestion and processing logic
"""

from datetime import datetime
from typing import List, Dict, Optional, Tuple
from collections import defaultdict

from ...models import (
    Signal, SignalSource, SignalSeverity, SignalTrend, GCCRegion,
    SignalSnapshot, SignalFilter, SignalAggregation, SignalGroup
)


class SignalProcessor:
    """
    Processes raw signals into structured intelligence.
    Handles normalization, severity calculation, and trend detection.
    """

    # Severity thresholds by signal type
    SEVERITY_THRESHOLDS = {
        "oil_price": {"low": 60, "medium": 80, "high": 100, "critical": 120},
        "inflation": {"low": 2, "medium": 3.5, "high": 5, "critical": 7},
        "claims_rate": {"low": 0.3, "medium": 0.5, "high": 0.7, "critical": 0.85},
        "fraud_index": {"low": 0.1, "medium": 0.25, "high": 0.4, "critical": 0.6},
        "loss_ratio": {"low": 0.5, "medium": 0.65, "high": 0.8, "critical": 0.95},
    }

    def __init__(self):
        self._signal_history: Dict[str, List[Tuple[datetime, float]]] = defaultdict(list)
        self._current_snapshot: Optional[SignalSnapshot] = None

    def ingest_signal(self, signal: Signal) -> Signal:
        """
        Ingest a single signal, calculate derived properties.
        """
        # Store in history for trend calculation
        self._signal_history[signal.id].append((signal.timestamp, signal.value))
        
        # Calculate severity if not provided
        if signal.severity is None:
            signal.severity = self._calculate_severity(signal)
        
        # Calculate trend if not provided
        if signal.trend is None:
            signal.trend = self._calculate_trend(signal.id)
        
        return signal

    def ingest_batch(self, signals: List[Signal]) -> SignalSnapshot:
        """
        Ingest multiple signals and create a snapshot.
        """
        processed = [self.ingest_signal(s) for s in signals]
        
        # Group signals by source
        groups = self._group_signals(processed)
        
        snapshot = SignalSnapshot(
            signals=processed,
            groups=groups,
            snapshot_timestamp=datetime.utcnow()
        )
        
        self._current_snapshot = snapshot
        return snapshot

    def filter_signals(self, signals: List[Signal], filter: SignalFilter) -> List[Signal]:
        """
        Apply filters to signal list.
        """
        result = signals
        
        if filter.sources:
            result = [s for s in result if s.source in filter.sources]
        
        if filter.regions:
            result = [s for s in result if s.region in filter.regions]
        
        if filter.severities:
            result = [s for s in result if s.severity in filter.severities]
        
        if filter.trends:
            result = [s for s in result if s.trend in filter.trends]
        
        if filter.min_confidence is not None:
            result = [s for s in result if (s.confidence or 0) >= filter.min_confidence]
        
        if filter.date_from:
            result = [s for s in result if s.timestamp >= filter.date_from]
        
        if filter.date_to:
            result = [s for s in result if s.timestamp <= filter.date_to]
        
        return result

    def aggregate_signals(self, signals: List[Signal]) -> SignalAggregation:
        """
        Calculate aggregations across signals.
        """
        by_source = defaultdict(int)
        by_region = defaultdict(int)
        by_severity = defaultdict(int)
        critical_count = 0
        
        for signal in signals:
            by_source[signal.source] += 1
            if signal.region:
                by_region[signal.region] += 1
            if signal.severity:
                by_severity[signal.severity] += 1
                if signal.severity == SignalSeverity.CRITICAL:
                    critical_count += 1
        
        return SignalAggregation(
            by_source=dict(by_source),
            by_region=dict(by_region),
            by_severity=dict(by_severity),
            total_count=len(signals),
            critical_count=critical_count
        )

    def get_critical_signals(self, signals: List[Signal]) -> List[Signal]:
        """
        Extract signals requiring immediate attention.
        """
        return [
            s for s in signals 
            if s.severity in [SignalSeverity.HIGH, SignalSeverity.CRITICAL]
        ]

    def _calculate_severity(self, signal: Signal) -> SignalSeverity:
        """
        Calculate severity based on signal type and value.
        """
        # Extract base name from signal ID or name
        signal_type = signal.name.lower().replace(" ", "_")
        
        thresholds = self.SEVERITY_THRESHOLDS.get(signal_type)
        if not thresholds:
            # Default severity calculation
            return SignalSeverity.MEDIUM
        
        value = signal.value
        if value < thresholds["low"]:
            return SignalSeverity.LOW
        elif value < thresholds["medium"]:
            return SignalSeverity.MEDIUM
        elif value < thresholds["high"]:
            return SignalSeverity.HIGH
        else:
            return SignalSeverity.CRITICAL

    def _calculate_trend(self, signal_id: str, window: int = 5) -> SignalTrend:
        """
        Calculate trend based on historical values.
        """
        history = self._signal_history.get(signal_id, [])
        
        if len(history) < 2:
            return SignalTrend.STABLE
        
        # Get recent values
        recent = sorted(history, key=lambda x: x[0])[-window:]
        values = [v for _, v in recent]
        
        if len(values) < 2:
            return SignalTrend.STABLE
        
        # Calculate trend
        changes = [values[i+1] - values[i] for i in range(len(values)-1)]
        avg_change = sum(changes) / len(changes)
        volatility = sum(abs(c - avg_change) for c in changes) / len(changes)
        
        # Determine trend
        threshold = 0.05 * abs(values[-1]) if values[-1] != 0 else 0.05
        
        if volatility > threshold * 2:
            return SignalTrend.VOLATILE
        elif avg_change > threshold:
            return SignalTrend.RISING
        elif avg_change < -threshold:
            return SignalTrend.FALLING
        else:
            return SignalTrend.STABLE

    def _group_signals(self, signals: List[Signal]) -> List[SignalGroup]:
        """
        Group signals by source.
        """
        groups_dict: Dict[SignalSource, List[Signal]] = defaultdict(list)
        
        for signal in signals:
            groups_dict[signal.source].append(signal)
        
        groups = []
        for source, source_signals in groups_dict.items():
            # Calculate aggregate severity for group
            severities = [s.severity for s in source_signals if s.severity]
            if SignalSeverity.CRITICAL in severities:
                agg_severity = SignalSeverity.CRITICAL
            elif SignalSeverity.HIGH in severities:
                agg_severity = SignalSeverity.HIGH
            elif SignalSeverity.MEDIUM in severities:
                agg_severity = SignalSeverity.MEDIUM
            else:
                agg_severity = SignalSeverity.LOW
            
            groups.append(SignalGroup(
                group_id=f"GRP-{source.value}",
                name=f"{source.value} Signals",
                signals=source_signals,
                aggregate_severity=agg_severity
            ))
        
        return groups
