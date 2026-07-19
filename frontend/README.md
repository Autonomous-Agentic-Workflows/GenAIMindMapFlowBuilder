# Frontend Development

GenAI MindMap Flow Builder frontend built with React + Vite

## Features

- Mind Map Visualization (D3.js force simulation)
- Flow CRUD Operations
- QA/Chat Interface
- Document Ingestion
- Real-time Backend Status
- Responsive Design

## Project Structure

```
frontend/
├── index.html           # Entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── src/
│   ├── main.jsx        # React entry
│   ├── App.jsx         # Main component
│   ├── api.js          # API client (36 routes)
│   ├── index.css       # Styling
│   └── components/
│       ├── MindMapCanvas.jsx    # D3 visualization
│       ├── FlowEditor.jsx       # Flow editing
│       ├── QAPanel.jsx          # Q&A interface
│       └── DocumentUpload.jsx   # Document uploader
└── public/             # Static assets
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Server: http://localhost:5173
Backend API: http://localhost:8000 (proxied via `/api`)

## Building

```bash
npm run build
```

## API Integration

Frontend connects to all 36 backend routes:

**Flows** (6 routes):
- `GET /flows` - List all flows
- `POST /flows` - Create flow
- `GET /flows/{id}` - Get flow
- `PUT /flows/{id}` - Update flow
- `DELETE /flows/{id}` - Delete flow
- `GET /flows/{id}/nodes` - Get flow nodes

**QA/Chat** (15 routes):
- `POST /qa/ask` - Ask question
- `POST /qa/chat` - Chat with context
- `GET /qa/conversations` - List conversations
- ... (12 more routes)

**Document Ingestion** (12 routes):
- `POST /ingestion/upload` - Upload document
- `POST /ingestion/process/{id}` - Process document
- `GET /ingestion/documents` - List documents
- ... (9 more routes)

**Database** (2 routes):
- `POST /sql/query` - Execute query
- `GET /sql/schema` - Get schema

**Health** (1 route):
- `GET /health` - Health check

## Components

### MindMapCanvas
- Renders interactive mind map with D3
- Node-link force simulation
- Real-time position updates

### FlowEditor
- Edit flow name and description
- Save changes to backend
- Validation and error handling

### QAPanel
- Ask questions to backend
- View response history
- Real-time feedback

### DocumentUpload
- Upload PDFs and documents
- Track processing status
- List uploaded documents

## Styling

- Responsive grid layout
- Gradient header (purple theme)
- Tab-based navigation
- Form inputs with focus states
- Status indicators (healthy/offline)

## Build & Deploy

```bash
# Build for production
npm run build

# Output: dist/ directory
# Deploy to GitHub Pages or any static host
```

## Notes

- Frontend uses Vite for fast development
- Vite proxy forwards `/api/*` to backend
- All API calls via `src/api.js` client
- Components use React hooks for state
- D3.js for mind map visualization
