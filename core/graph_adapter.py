"""DEEVO Cortex — Graph Adapter

Official VERCEPT integration entrypoint for graph operations.
Delegates entirely to core.graph_engine — no logic here.

VERCEPT contract:
    get_graph_state(signals?, country_id?, lob?) -> dict
    propagate(source, value?, signals?, country_id?, lob?) -> dict
"""

from typing import Optional

from core.graph_engine import (
    get_graph_state as _get_graph_state,
    propagate as _propagate,
)


def get_graph_state(
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
) -> dict:
    """Return current graph state. JSON-serializable.

    See core.graph_engine.get_graph_state for details.
    """
    return _get_graph_state(
        signals=signals,
        country_id=country_id,
        lob=lob,
    )


def propagate(
    source: str,
    value: Optional[float] = None,
    signals: Optional[dict] = None,
    country_id: Optional[str] = None,
    lob: Optional[str] = None,
) -> dict:
    """Propagate impact from a single source node. JSON-serializable.

    Returns dict with keys: graph_state, propagation_trace.
    See core.graph_engine.propagate for details.
    """
    return _propagate(
        source=source,
        value=value,
        signals=signals,
        country_id=country_id,
        lob=lob,
    )
