import { useState } from 'react'

export default function FlowEditor({ flow }) {
  const [name, setName] = useState(flow?.name || '')
  const [description, setDescription] = useState(flow?.description || '')

  return (
    <div className="flow-editor">
      <h3>Edit Flow</h3>
      <div className="form-group">
        <label>Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Flow name"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Flow description"
          rows={4}
        />
      </div>
      <button className="btn-primary">Save Changes</button>
    </div>
  )
}
