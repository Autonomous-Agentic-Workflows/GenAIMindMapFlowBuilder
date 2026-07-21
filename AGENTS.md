# AGENTS.md — Agent Integration Guide

This repo is wired for multi-agent development. Agents reach it three ways: GitHub-native dispatch (Claude), repo-defined custom agents (Copilot), and the local agent fleet via `repository_dispatch`.

## Repo basics

- **Backend**: FastAPI, modular routers in `backend/routers/` (`flows`, `qa`, `ingestion`, `sql`, `nodes`), entrypoint `backend/app.py`.
- **Frontend**: React + Vite in `frontend/`.
- **Validate backend**: `pip install -r backend/requirements_minimal.txt && python -c "from backend.routers import flows, qa, ingestion, sql, nodes"`
- **CI**: `backend-ci.yml`, `frontend-ci.yml`, `neurite-integration.yml`, `pr-checks.yml`. Keep router registrations in `backend/app.py` in sync with `pr-checks.yml`.

## 1. Claude dispatch (`.github/workflows/claude.yml`)

| Channel | How |
|---|---|
| Mention | Comment `@claude <task>` on any issue, PR, or review |
| Manual | Actions → *Claude Dispatch* → Run workflow with a prompt |
| API (for agents) | `repository_dispatch` with `event_type: claude-task` |

Programmatic dispatch from any agent with a `repo`-scoped token:

```bash
gh api repos/Autonomous-Agentic-Workflows/GenAIMindMapFlowBuilder/dispatches \
  -f event_type=claude-task \
  -f 'client_payload[prompt]=Fix the failing backend-ci job on main'
```

Requires the `ANTHROPIC_API_KEY` secret (repo or org level).

## 2. Copilot custom agents (`.github/agents/`)

- **cli-recovery-agent** — diagnose/fix CLI and system failures
- **tech-translator** — explain concepts, errors, and next steps

These are picked up automatically by Copilot CLI and coding agent sessions in this repo.

## 3. Local agent fleet (Ollama, runs on the hub machine)

Dispatched via `scripts/sub_agent_dispatcher.py` in the hub repo; escalates to cloud models only when local tiers can't handle the task.

| Agent | Model | Role |
|---|---|---|
| `router-agent` | `tinyllama:latest` | Task classification & complexity scoring |
| `embed-agent` | `nomic-embed-text` | Semantic embeddings & similarity |
| `code-agent` | `qwen2.5-coder:1.5b` | Code review, log parsing, basic debug |
| `plan-agent` | `qwen2.5-coder:3b` | Planning & orchestration |
| `summarize-agent` | `qwen2.5-coder:1.5b` | Summarization & extraction |
| `debug-agent` | `qwen2.5-coder:1.5b` | Error diagnosis & fix suggestions |

Escalation chain: local fleet → `qwen2.5-coder:3b` → OpenRouter (free) → Together.AI → native APIs (Claude/Copilot/Gemini/Codex). Local agents hand work to this repo through the `claude-task` dispatch above or by opening issues mentioning `@claude`.

## Conventions for all agents

- Work on a branch; open a PR — CI must pass before merge.
- Never commit secrets; use repo/org Actions secrets.
- Keep commits scoped: backend, frontend, and CI changes in separate commits where practical.
