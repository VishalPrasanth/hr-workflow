import React from 'react';

type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

type NodeItem = {
  id: NodeKind;
  label: string;
  description: string;
  color: string;
};

type SidebarProps = {
  onAddNode: (kind: NodeKind) => void;
};

const NODES: NodeItem[] = [
  {
    id: 'start',
    label: 'Start',
    description: 'Begin your workflow here',
    color: '#10B981', // emerald-500
  },
  {
    id: 'task',
    label: 'Task',
    description: 'A manual task step',
    color: '#3B82F6', // blue-500
  },
  {
    id: 'approval',
    label: 'Approval',
    description: 'Requires manual approval',
    color: '#F59E0B', // amber-500
  },
  {
    id: 'automated',
    label: 'Automated',
    description: 'Runs automatically',
    color: '#8B5CF6', // violet-500
  },
  {
    id: 'end',
    label: 'End',
    description: 'Finish the workflow',
    color: '#EF4444', // red-500
  },
];

const sidebarStyle: React.CSSProperties = {
  width: '250px',
  height: '100%',
  backgroundColor: '#f4f3ee', // Updated to new background color
  color: '#1E293B', // Dark text for better contrast
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderRight: '1px solid #d9d7d0', // Lighter border to match new background
};

const nodeItemStyle = (color: string): React.CSSProperties & { '&:hover'?: React.CSSProperties } => ({
  backgroundColor: '#e8e6e1', // Lighter background for nodes
  borderLeft: `4px solid ${color}`,
  borderRadius: '6px',
  padding: '12px',
  cursor: 'grab',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#d9d7d0', // Slightly darker on hover
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
});

export function Sidebar({ onAddNode }: SidebarProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, kind: NodeKind) => {
    // this key is what we'll read in WorkflowCanvas
    event.dataTransfer.setData('application/reactflow', kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px', color: '#1E293B' }}>Node Palette</h2>
        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
          Click or drag nodes onto the canvas to build a workflow.
        </p>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NODES.map((node) => (
          <div
            key={node.id}
            style={nodeItemStyle(node.color)}
            draggable
            onDragStart={(e) => onDragStart(e, node.id)}
            onClick={() => onAddNode(node.id)}
          >
            <div style={{ fontWeight: 500, color: '#1E293B' }}>{node.label}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{node.description}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #334155' }}>
        <p style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>
          Tip: Start → Tasks → End → then simulate
        </p>
      </div>
    </div>
  );
}
