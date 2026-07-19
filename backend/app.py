"""
GenAI MindMap Flow Builder - FastAPI Backend
Modular router architecture with Neurite integration
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

# Import routers
from routers import flows, qa, ingestion, sql, nodes
from neurite_client import NeuriteClient

# Initialize Neurite client
neurite = NeuriteClient()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic"""
    print("🚀 GenAI MindMap Flow Builder starting...")
    print("📡 Neurite integration:", "ENABLED" if neurite.is_available() else "DISABLED (graceful fallback)")
    print("📚 5 routers loaded (flows, qa, ingestion, sql, nodes)")
    print("🔗 36 API routes registered")
    yield
    print("🛑 GenAI MindMap Flow Builder shutdown")

# Create FastAPI app
app = FastAPI(
    title="GenAI MindMap Flow Builder",
    description="Modular FastAPI backend with Neurite integration",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(flows.router, prefix="/flows", tags=["flows"])
app.include_router(qa.router, prefix="/qa", tags=["qa"])
app.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
app.include_router(sql.router, prefix="/sql", tags=["sql"])
app.include_router(nodes.router, prefix="/nodes", tags=["nodes"])

# Root endpoint
@app.get("/")
async def root():
    """Health check and API overview"""
    return {
        "status": "operational",
        "service": "GenAI MindMap Flow Builder",
        "version": "1.0.0",
        "routers": ["flows", "qa", "ingestion", "sql", "nodes"],
        "routes": 36,
        "neurite_status": "enabled" if neurite.is_available() else "disabled",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "neurite": {
            "available": neurite.is_available(),
            "endpoint": "http://localhost:18888" if neurite.is_available() else None
        },
        "routers": {
            "flows": "active",
            "qa": "active",
            "ingestion": "active",
            "sql": "active",
            "nodes": "active"
        }
    }

if __name__ == "__main__":
    print("\n" + "="*80)
    print("GenAI MindMap Flow Builder - Backend Server")
    print("="*80)
    print("\n📖 Documentation:")
    print("   - Swagger UI: http://localhost:8000/docs")
    print("   - ReDoc: http://localhost:8000/redoc")
    print("   - Health: http://localhost:8000/health")
    print("\n")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
