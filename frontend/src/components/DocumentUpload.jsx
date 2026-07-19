import { useState } from 'react'
import { ingestionAPI } from '../api'

export default function DocumentUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState([])

  const handleUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    setUploading(true)
    try {
      const { data } = await ingestionAPI.upload(uploadedFile)
      setDocuments([...documents, data])
      setFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="document-upload">
      <h3>Document Ingestion</h3>
      <div className="upload-area">
        <input 
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept=".pdf,.txt,.doc,.docx"
        />
        {uploading && <p>Uploading...</p>}
      </div>
      <div className="document-list">
        <h4>Uploaded Documents ({documents.length})</h4>
        {documents.map((doc, idx) => (
          <div key={idx} className="doc-item">
            <span>{doc.filename}</span>
            <span className="doc-status">{doc.processed ? 'Processed' : 'Processing'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
