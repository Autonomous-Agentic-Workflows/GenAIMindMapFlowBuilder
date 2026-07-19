import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function MindMapCanvas({ flow }) {
  const svgRef = useRef()

  useEffect(() => {
    if (!flow || !svgRef.current) return

    const nodes = flow.nodes || []
    const edges = flow.edges || []

    // Simple force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(300, 200))

    const svg = d3.select(svgRef.current)
    
    // Draw links
    const links = svg.selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .style('stroke', '#ccc')
      .style('stroke-width', 2)

    // Draw nodes
    const nodeElements = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .style('fill', '#69b3a2')
      .style('cursor', 'pointer')

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeElements
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    })

  }, [flow])

  return (
    <svg 
      ref={svgRef} 
      width={600} 
      height={400} 
      style={{ border: '1px solid #ddd', background: '#fafafa' }}
    />
  )
}
