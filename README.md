# GenAI MindMap Flow Builder

Modular FastAPI backend for AI-powered mind mapping with Neurite integration, document ingestion, QA/chat functionality, and data persistence.

## Architecture

Backend refactored from monolithic `app.py` into 5 modular FastAPI routers:

### Routers

1. **flows.py** (6 routes) - Flow CRUD operations
   - `POST /flows` - Create flow
   - `GET /flows` - List flows
   - `GET /flows/{id}` - Get flow details
   - `PUT /flows/{id}` - Update flow
   - `DELETE /flows/{id}` - Delete flow
   - `GET /flows/{id}/nodes` - Get flow nodes

2. **qa.py** (15 routes) - QA/chat and conversation management
   - Chat endpoints with streaming support
   - Question-answering operations
   - Conversation history management
   - Context awareness

3. **ingestion.py** (12 routes) - Document ingestion and processing
   - PDF/document upload
   - Text extraction
   - Chunking and embedding
   - Indexing operations

4. **sql.py** (2 routes) - Database operations
   - Query execution
   - Schema inspection

5. **nodes.py** (1 route) - Mind map node management
   - Node CRUD

### Features

- **Dependency Injection**: All routers use FastAPI's dependency injection pattern for configuration and authentication
- **Neurite Integration**: Bi-directional communication with Neurite system via `neurite_client.py`
- **Graceful Fallback**: Backend operates independently if Neurite unavailable
- **SQLAlchemy v1.4.50**: Resolved dependency conflicts with compatible version
- **36 Total API Routes**: Comprehensive endpoint coverage
- **CI/CD Ready**: 4 GitHub Actions workflows for automated testing and deployment

## Project Structure

```
backend/
├── app.py                 # Main FastAPI app with router registration
├── neurite_client.py      # Neurite integration bridge
├── requirements_minimal.txt
├── requirements_core.txt
├── routers/
│   ├── flows.py          # Flow CRUD endpoints
│   ├── qa.py             # QA/chat endpoints
│   ├── ingestion.py      # Document ingestion
│   ├── sql.py            # Database operations
│   └── nodes.py          # Node management
└── ...

.github/
├── workflows/
│   ├── neurite-integration.yml    # Full integration testing
│   ├── backend-ci.yml            # Python 3.10-3.12 matrix
│   ├── frontend-ci.yml           # Node 18-20 matrix
│   └── pr-checks.yml             # Router validation
└── ...
```

## Installation

```bash
# Using minimal requirements (16 packages)
pip install -r backend/requirements_minimal.txt

# Or fallback requirements (6 packages)
pip install -r backend/requirements_core.txt
```

## Running the Backend

```bash
cd backend
python app.py
```

Server starts at `http://localhost:8000`

## API Documentation

FastAPI automatically generates API docs at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Neurite Integration

The backend integrates with Neurite via `neurite_client.py`:

```python
from backend.neurite_client import NeuriteClient

neurite = NeuriteClient()

# Check if Neurite is available
if neurite.is_available():
    # Forward request to Neurite
    result = neurite.forward_request("flow_analysis", data)
    
    # Sync system map
    neurite.update_system_map({"type": "flow_created", "id": flow_id})
```

Features:
- Automatic health checks via `is_available()`
- Request proxying through AI Proxy
- System map synchronization
- Graceful fallback when unavailable

## GitHub Actions CI/CD

4 automated workflows on push:

1. **neurite-integration.yml** - Full integration testing
2. **backend-ci.yml** - Python 3.10-3.12 tests
3. **frontend-ci.yml** - Node.js 18-20 tests
4. **pr-checks.yml** - Router structure validation

All workflows execute in parallel and must pass for merge.

## Documentation

- **COMPLETE_INTEGRATION_GUIDE.md** - Step-by-step setup
- **GENAI_GIT_WORKFLOW.md** - Git workflow integration
- **UNIFIED_AGENT_CONTEXT.md** - Agent coordination system
- **NEURITE_INTEGRATION.md** - Detailed Neurite setup

## Technology Stack

- **Framework**: FastAPI
- **ORM**: SQLAlchemy 1.4.50
- **API Server**: Uvicorn
- **Async**: asyncio
- **Validation**: Pydantic
- **Testing**: pytest

## Development

### Adding a New Route

1. Create endpoint in appropriate router (`routers/flows.py`, etc.)
2. Use FastAPI decorator (`@router.post()`, etc.)
3. Route automatically included via `include_router()` in `app.py`
4. Document in README

### Testing Routes Locally

```bash
# Run app with reload
python app.py

# Test endpoint
curl http://localhost:8000/flows
```

## Deployment

All GitHub Actions workflows configured for automated deployment on push. See `.github/workflows/` for details.

## License

MIT

## Contact

For issues or questions, contact the development team.

---

**Total Deliverables**:
- 5 modular routers
- 36 API routes
- 4 CI/CD workflows
- Neurite integration
- Comprehensive documentation
- Automated deployment
