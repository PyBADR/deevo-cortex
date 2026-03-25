"""
DEEVO Cortex - Signals API Routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime

from ...models import (
    Signal, SignalSnapshot, SignalFilter, SignalAggregation,
    SignalSource, SignalSeverity, GCCRegion
)
from ...engine.signals.processor import SignalProcessor

router = APIRouter(prefix="/signals", tags=["Signals"])

# Global processor instance (in production, use dependency injection)
signal_processor = SignalProcessor()


@router.post("/ingest", response_model=SignalSnapshot)
async def ingest_signals(signals: List[Signal]):
    """
    Ingest a batch of signals and return processed snapshot.
    """
    try:
        snapshot = signal_processor.ingest_batch(signals)
        return snapshot
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/snapshot", response_model=SignalSnapshot)
async def get_current_snapshot():
    """
    Get the current signal snapshot.
    """
    if signal_processor._current_snapshot is None:
        raise HTTPException(status_code=404, detail="No snapshot available")
    return signal_processor._current_snapshot


@router.post("/filter", response_model=List[Signal])
async def filter_signals(filter: SignalFilter):
    """
    Filter signals based on criteria.
    """
    if signal_processor._current_snapshot is None:
        raise HTTPException(status_code=404, detail="No snapshot available")
    
    filtered = signal_processor.filter_signals(
        signal_processor._current_snapshot.signals,
        filter
    )
    return filtered


@router.get("/aggregate", response_model=SignalAggregation)
async def aggregate_signals():
    """
    Get signal aggregations.
    """
    if signal_processor._current_snapshot is None:
        raise HTTPException(status_code=404, detail="No snapshot available")
    
    return signal_processor.aggregate_signals(
        signal_processor._current_snapshot.signals
    )


@router.get("/critical", response_model=List[Signal])
async def get_critical_signals():
    """
    Get signals requiring immediate attention.
    """
    if signal_processor._current_snapshot is None:
        raise HTTPException(status_code=404, detail="No snapshot available")
    
    return signal_processor.get_critical_signals(
        signal_processor._current_snapshot.signals
    )


@router.get("/sources", response_model=List[str])
async def get_signal_sources():
    """
    Get available signal sources.
    """
    return [s.value for s in SignalSource]


@router.get("/regions", response_model=List[str])
async def get_gcc_regions():
    """
    Get available GCC regions.
    """
    return [r.value for r in GCCRegion]
