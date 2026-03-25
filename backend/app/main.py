"""
DEEVO Cortex - FastAPI Application
DEEVO Decision Intelligence Backend
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import logging

from .api.routes import signals, decisions, simulation
from .api.routes import graph, intelligence

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("cortex-v2")

# Create FastAPI app
app = FastAPI(
    title="DEEVO Cortex",
    description="DEEVO Decision Intelligence for GCC + Insurance + Economic Risk",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
# Legacy/specialized routes (v1)
app.include_router(signals.router, prefix="/api/v1")
app.include_router(decisions.router, prefix="/api/v1")
app.include_router(simulation.router, prefix="/api/v1")

# Graph routes
app.include_router(graph.router)  # /api/graph/*

# CANONICAL: Unified Intelligence Route (Phase 3.6)
app.include_router(intelligence.router)  # /api/intelligence/*


@app.get("/")
async def root():
    """
    Root endpoint - system info.
    """
    return {
        "system": "DEEVO Cortex",
        "version": "2.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "intelligence": "/api/intelligence/run",  # CANONICAL
            "signals": "/api/v1/signals",
            "decisions": "/api/v1/decisions",
            "simulation": "/api/v1/simulation",
            "graph": "/api/graph/state",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "signal_processor": "operational",
            "decision_engine": "operational",
            "simulation_engine": "operational"
        }
    }


@app.get("/api/v1/system/status")
async def system_status():
    """
    Detailed system status.
    """
    return {
        "platform": "DEEVO Cortex",
        "mode": "deevo_decision_intelligence",
        "domains": ["GCC", "Insurance", "Economic Risk"],
        "capabilities": [
            "Signal Processing",
            "Causal Graph Analysis",
            "Rule Evaluation",
            "Decision Generation",
            "Scenario Simulation",
            "Monte Carlo Analysis",
            "Sensitivity Analysis",
            "Stress Testing"
        ],
        "layers": {
            "signals": "active",
            "graph": "active",
            "rules": "active",
            "simulation": "active",
            "decision": "active",
            "output": "active"
        }
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "timestamp": datetime.utcnow().isoformat()
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
