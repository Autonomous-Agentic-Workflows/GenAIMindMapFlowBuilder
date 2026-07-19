"""
Nodes Router - Mind map node management
"""

from fastapi import APIRouter

router = APIRouter()

# Routes
@router.post("")
async def create_node(node_data: dict):
    """Create a node"""
    return {"id": "node_001", "status": "created"}
