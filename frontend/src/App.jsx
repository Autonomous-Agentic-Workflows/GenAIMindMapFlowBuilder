import { useState, useEffect } from 'react'
import { flowsAPI, qaAPI, healthAPI } from './api'
import MindMapCanvas from './components/MindMapCanvas'
import FlowEditor from './components/FlowEditor'
import QAPanel from './components/QAPanel'
import DocumentUpload from './components/DocumentUpload'
import './App.css'

export default function App() {
  const [flows, setFlows] = useState([])
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [activeTab, setActiveTab] = useState('flows')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check backend health
    healthAPI.check()
      .then(() => {
        setBackendStatus('healthy')
        loadFlows()
      })
      .catch(() => {
        setBackendStatus('offline')
      })
      .finally(() => setLoading(false))
  }, [])

  const loadFlows = async () => {
    try {
      const { data } = await flowsAPI.list()
      setFlows(data)
    } catch (error) {
      console.error('Failed to load flows:', error)
    }
  }

  const handleCreateFlow = async (flowName) => {
    try {
      const { data } = await flowsAPI.create({ name: flowName })
      setFlows([...flows, data])
      setSelectedFlow(data)
    } catch (error) {
      console.error('Failed to create flow:', error)
    }
  }

  const handleDeleteFlow = async (flowId) => {
    try {
      await flowsAPI.delete(flowId)
      setFlows(flows.filter(f => f.id !== flowId))
      if (selectedFlow?.id === flowId) setSelectedFlow(null)
    } catch (error) {
      console.error('Failed to delete flow:', error)
    }
  }

  if (loading) {
    return <div className="loading">Initializing GenAI MindMap...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>GenAI MindMap Flow Builder</h1>
        <div className="status">
          Backend: <span className={`status-${backendStatus}`}>{backendStatus}</span>
        </div>
      </header>

      <div className="app-container">
        <nav className="tabs">
          <button 
            className={`tab ${activeTab === 'flows' ? 'active' : ''}`}
            onClick={() => setActiveTab('flows')}
          >
            Flows
          </button>
          <button 
            className={`tab ${activeTab === 'qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            QA/Chat
          </button>
          <button 
            className={`tab ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            Documents
          </button>
        </nav>

        <div className="content">
          {activeTab === 'flows' && (
            <div className="flows-section">
              <div className="sidebar">
                <h3>Flows</h3>
                <button onClick={() => handleCreateFlow('New Flow')}>+ New Flow</button>
                <ul className="flow-list">
                  {flows.map(flow => (
                    <li 
                      key={flow.id}
                      className={selectedFlow?.id === flow.id ? 'active' : ''}
                      onClick={() => setSelectedFlow(flow)}
                    >
                      {flow.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="editor">
                {selectedFlow ? (
                  <FlowEditor flow={selectedFlow} />
                ) : (
                  <div className="placeholder">Select or create a flow to get started</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="qa-section">
              <QAPanel />
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="docs-section">
              <DocumentUpload />
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>GenAI MindMap Flow Builder v1.0.0 | Neurite Integration Ready</p>
        <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">API Docs</a>
      </footer>
    </div>
  )
}
