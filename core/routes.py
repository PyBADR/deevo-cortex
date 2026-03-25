"""DEEVO Cortex — FastAPI Routes

Minimal route definitions that wire the frontend to the integration layer.
Each route is a thin wrapper — zero business logic lives here.

Routes:
    GET  /api/health              → system health check
    GET  /api/settings            → bilingual settings payload
    POST /api/intelligence/run    → full unified engine output (8-key)
    POST /api/intelligence/ui     → shaped UI payload for GCC Command Center

Phase 4.1+ — Route Layer
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict

from core.integration import (
    build_ui_payload_from_engine,
    build_settings,
    build_settings_bilingual,
    execute_unified,
    health,
)


# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(prefix="/api", tags=["intelligence"])


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class IntelligenceRequest(BaseModel):
    """Request body for intelligence endpoints."""
    signals: Optional[Dict[str, float]] = Field(
        None,
        description="Signal overrides. None = use canonical data/signals.json.",
        examples=[{"oil_price": 130, "inflation": 5.8, "claims_rate": 0.72}],
    )
    country_id: Optional[str] = Field(
        None,
        description="GCC country filter: SA, AE, KW, QA, BH, OM.",
        pattern="^(SA|AE|KW|QA|BH|OM)$",
    )
    lob: Optional[str] = Field(
        None,
        description="Insurance line filter: motor, medical, property, marine.",
        pattern="^(motor|medical|property|marine)$",
    )
    previous_signals: Optional[Dict[str, float]] = Field(
        None,
        description="Prior tick signals for delta/direction computation.",
    )


class UIPayloadRequest(IntelligenceRequest):
    """Request body for the UI payload endpoint."""
    locale: str = Field(
        "en",
        description="Locale for label selection: 'en' or 'ar'.",
        pattern="^(en|ar)$",
    )


# ---------------------------------------------------------------------------
# GET /api/health
# ---------------------------------------------------------------------------

@router.get("/health")
def get_health():
    """System health check — no authentication required."""
    return health()


# ---------------------------------------------------------------------------
# GET /api/settings
# ---------------------------------------------------------------------------

@router.get("/settings")
def get_settings(
    locale: Optional[str] = Query(
        None,
        description="Locale: 'en', 'ar', or omit for bilingual.",
        regex="^(en|ar)$",
    ),
):
    """Return the full settings payload for the DEEVO GCC Command Center settings modal.

    - locale=en  → English labels only
    - locale=ar  → Arabic labels only
    - omit       → bilingual payload (EN + AR)
    """
    try:
        if locale is None:
            return build_settings_bilingual()
        return build_settings(locale=locale)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# POST /api/intelligence/run
# ---------------------------------------------------------------------------

@router.post("/intelligence/run")
def post_intelligence_run(req: IntelligenceRequest):
    """Run the unified engine and return the full 8-key output.

    This is the canonical intelligence endpoint. Returns:
        simulation_result, decision_trace, decision, graph_state,
        propagation_trace, enriched_signals, executive_brief, signal_summary.
    """
    try:
        return execute_unified(
            signals=req.signals,
            country_id=req.country_id,
            lob=req.lob,
            previous_signals=req.previous_signals,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# POST /api/intelligence/ui
# ---------------------------------------------------------------------------

@router.post("/intelligence/ui")
def post_intelligence_ui(req: UIPayloadRequest):
    """Run the unified engine and return a shaped UI payload.

    Returns a panel-ready structure for the GCC Command Center:
        top_bar, signal_rail, decision_rail, propagation_panel,
        executive_brief, graph_summary, raw.
    """
    try:
        return build_ui_payload_from_engine(
            signals=req.signals,
            country_id=req.country_id,
            lob=req.lob,
            locale=req.locale,
            previous_signals=req.previous_signals,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
