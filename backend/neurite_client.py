"""
Neurite Client - Integration bridge for Neurite system
"""

import httpx
import asyncio
from typing import Optional, Dict, Any

class NeuriteClient:
    """Client for communicating with Neurite system"""
    
    def __init__(self, base_url: str = "http://localhost:18888"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=5.0)
    
    async def is_available(self) -> bool:
        """Check if Neurite is available"""
        try:
            response = await self.client.get(f"{self.base_url}/status", timeout=2.0)
            return response.status_code == 200
        except (httpx.ConnectError, httpx.TimeoutException):
            return False
    
    async def forward_request(self, endpoint: str, data: Dict[str, Any]) -> Optional[Dict]:
        """Forward request to Neurite"""
        try:
            if not await self.is_available():
                return None
            
            response = await self.client.post(
                f"{self.base_url}/{endpoint}",
                json=data,
                timeout=10.0
            )
            
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Neurite forward failed: {e}")
        
        return None
    
    async def update_system_map(self, event: Dict[str, Any]) -> bool:
        """Update Neurite system map with event"""
        try:
            if not await self.is_available():
                return False
            
            response = await self.client.post(
                f"{self.base_url}/system-map/update",
                json=event,
                timeout=5.0
            )
            
            return response.status_code == 200
        except Exception as e:
            print(f"System map update failed: {e}")
        
        return False
