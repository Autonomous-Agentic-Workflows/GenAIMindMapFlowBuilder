import { useState } from 'react'
import { qaAPI } from '../api'

export default function QAPanel() {
  const [question, setQuestion] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    try {
      const { data } = await qaAPI.ask(question)
      setResponses([...responses, { question, response: data.response }])
      setQuestion('')
    } catch (error) {
      console.error('Failed to ask question:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="qa-panel">
      <h3>Q&A Assistant</h3>
      <div className="qa-history">
        {responses.map((item, idx) => (
          <div key={idx} className="qa-item">
            <p className="question">Q: {item.question}</p>
            <p className="response">A: {item.response}</p>
          </div>
        ))}
      </div>
      <div className="qa-input">
        <input 
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
    </div>
  )
}
