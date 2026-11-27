# GenAI MindMap Flow Builder

A FastAPI backend and a React + Vite frontend for AI-assisted mind maps and flows. The backend is split into routers for flows, Q&A, document ingestion, SQL, and nodes. It can optionally talk to a local Neurite service, and it starts even when Neurite is not running.

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements_minimal.txt
python app.py
```

The API listens on `http://localhost:8000` (all interfaces in `app.py`). Interactive docs:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite app is documented as listening on http://localhost:5173 and proxying `/api` to the backend on port 8000. See [frontend/README.md](frontend/README.md).

## Configuration

There is no `.env.example` in this repository. `python-dotenv` is listed in `backend/requirements_minimal.txt`, but `backend/neurite_client.py` currently defaults to `http://localhost:18888` in code rather than reading an environment variable. If you run Neurite elsewhere, you would need to change that client or add configuration — this docs pass does not invent an undocumented env var.

CORS on the backend is currently open (`allow_origins=["*"]`). Do not expose it on a public network as-is.

## API overview

Routers are registered in `backend/app.py`:

| Prefix | Module | Role |
| --- | --- | --- |
| `/flows` | `backend/routers/flows.py` | Flow CRUD and flow nodes |
| `/qa` | `backend/routers/qa.py` | Q&A and conversations |
| `/ingestion` | `backend/routers/ingestion.py` | Document upload and processing |
| `/sql` | `backend/routers/sql.py` | Query and schema helpers |
| `/nodes` | `backend/routers/nodes.py` | Mind-map node operations |
| `/` and `/health` | `backend/app.py` | Status and health |

The app and frontend comments describe 36 API routes in total. Use `/docs` as the live list; it is the source of truth if a README count drifts.

Neurite integration (`backend/neurite_client.py`):

- `is_available()` checks `GET {base}/status`
- `forward_request(endpoint, data)` posts to Neurite
- `update_system_map(event)` posts to `/system-map/update`

If Neurite is down, those calls return `None` / `False` and the backend still serves its own routes.

## Project layout

```
backend/
  app.py
  neurite_client.py
  requirements_minimal.txt
  routers/           flows, qa, ingestion, sql, nodes
frontend/
  README.md
  package.json       scripts: dev, build, preview
  src/               React app, API client, components
.github/workflows/   CI workflows (backend, frontend, PR checks, Neurite integration)
AGENTS.md            Notes for coding agents
```

Note: an older root README mentioned `requirements_core.txt` and several root markdown guides (`COMPLETE_INTEGRATION_GUIDE.md`, `GENAI_GIT_WORKFLOW.md`, `UNIFIED_AGENT_CONTEXT.md`, `NEURITE_INTEGRATION.md`). Those files are **not** in the current tree. Use this README, `frontend/README.md`, and `AGENTS.md` instead.

## Contributing and testing

```bash
# backend
cd backend && pip install -r requirements_minimal.txt
python app.py

# frontend
cd frontend && npm install && npm run build
```

GitHub Actions workflows under `.github/workflows/` run backend and frontend CI and PR checks. There is no root `pytest` suite checked in next to `app.py` in this pass.

Open a pull request against `main`. Do not commit secrets or virtualenvs.

## License

MIT — see [LICENSE](LICENSE).
