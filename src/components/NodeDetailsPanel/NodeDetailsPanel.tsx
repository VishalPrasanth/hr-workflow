import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';

import { StartNodeForm } from './StartNodeForm';
import { TaskNodeForm } from './TaskNodeForm';
import { ApprovalNodeForm } from './ApprovalNodeForm';
import { AutomatedNodeForm } from './AutomatedNodeForm';
import { EndNodeForm } from './EndNodeForm';

type NodeDetailsPanelProps = {
  node: Node | null;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
  onDeleteNode: (id: string) => void;
};

// const getNodeTypeLabel = (kind: string) => {
//   const labels: Record<string, string> = {
//     start: 'Start Node',
//     task: 'Task Node',
//     approval: 'Approval Node',
//     automated: 'Automated Node',
//     end: 'End Node',
//   };
//   return labels[kind] || 'Node';
// };

const getNodeTypeColor = (kind: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    start: { 
      bg: 'rgba(16, 185, 129, 0.1)', // emerald-500/10 
      text: '#10B981', // emerald-500
      border: '#10B981' // emerald-500
    },
    task: { 
      bg: 'rgba(59, 130, 246, 0.1)', // blue-500/10
      text: '#3B82F6', // blue-500
      border: '#3B82F6' // blue-500
    },
    approval: { 
      bg: 'rgba(245, 158, 11, 0.1)', // amber-500/10
      text: '#F59E0B', // amber-500
      border: '#F59E0B' // amber-500
    },
    automated: { 
      bg: 'rgba(139, 92, 246, 0.1)', // violet-500/10
      text: '#8B5CF6', // violet-500
      border: '#8B5CF6' // violet-500
    },
    end: { 
      bg: 'rgba(239, 68, 68, 0.1)', // red-500/10
      text: '#EF4444', // red-500
      border: '#EF4444' // red-500
    },
  };
  return colors[kind] || { bg: 'rgba(226, 232, 240, 0.5)', text: '#475569', border: '#E2E8F0' }; // slate
};

export function NodeDetailsPanel({
  node,
  onUpdateNodeData,
  onDeleteNode,
}: NodeDetailsPanelProps) {
  if (!node) {
    return (
      <div
        style={{
          width: '250px',
          height: '100%',
          backgroundColor: '#f4f3ee', // Updated to new background color
          borderLeft: '1px solid #d9d7d0', // Lighter border to match new background
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e8e6e1', // Lighter background for the icon container
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B" // slate-500 - darker for better contrast
            strokeWidth="1.5"
          >
            <path
              d="M3 3h18v18H3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M8 12h8m-4-4v8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#1E293B', // Dark text for better contrast
            margin: '0 0 8px 0',
          }}
        >
          No Node Selected
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#475569', // Darker text for better contrast
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Select a node on the canvas to edit its configuration.
        </p>
      </div>
    );
  }

  const data: any = node.data || {};
  const kind = data.type ?? data.kind ?? 'unknown';

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { label: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this node from the workflow?')) {
      onDeleteNode(node.id);
    }
  };

  return (
    <div
      style={{
        width: '250px',
        height: '100%',
        backgroundColor: '#f4f3ee', // Updated to new background color
        borderLeft: '1px solid #d9d7d0', // Lighter border to match new background
        display: 'flex',
        flexDirection: 'column',
        color: '#1E293B', // Dark text for better contrast
      }}
    >
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #d9d7d0', // Lighter border to match new background
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1E293B', // Dark text for better contrast
              margin: 0,
            }}
          >
            Node Details
          </h2>
          <div
            style={{
              backgroundColor: getNodeTypeColor(kind).bg,
              color: getNodeTypeColor(kind).text,
              border: `1px solid ${getNodeTypeColor(kind).border}`,
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'capitalize',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'brightness(0.95)', // Slightly darken the background for better contrast
            }}
          >
            <span style={{ marginTop: '1px' }}>{kind}</span>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: '#475569', // Darker text for better contrast
              marginBottom: '8px',
            }}
          >
            Node Label
          </label>
          <input
            type="text"
            value={String(data.label || '')}
            onChange={handleLabelChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #d9d7d0', // Lighter border to match new background
              backgroundColor: '#ffffff', // White background for input
              color: '#1E293B', // Dark text for better contrast
              boxShadow: 'none',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = getNodeTypeColor(kind).border;
              e.target.style.boxShadow = `0 0 0 1px ${getNodeTypeColor(kind).border}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d9d7d0'; // Lighter border to match new background
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter node label"
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#f4f3ee', // Updated to new background color
        }}
      >
        {/* Node Type Specific Forms */}
        <div style={{ marginBottom: '24px' }}>
          {kind === 'start' && (
            <StartNodeForm node={node} onUpdateNodeData={onUpdateNodeData} />
          )}

          {kind === 'task' && (
            <TaskNodeForm node={node} onUpdateNodeData={onUpdateNodeData} />
          )}

          {kind === 'approval' && (
            <ApprovalNodeForm node={node} onUpdateNodeData={onUpdateNodeData} />
          )}

          {kind === 'automated' && (
            <AutomatedNodeForm node={node} onUpdateNodeData={onUpdateNodeData} />
          )}

          {kind === 'end' && (
            <EndNodeForm node={node} onUpdateNodeData={onUpdateNodeData} />
          )}
        </div>
      </div>

      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #d9d7d0', // Lighter border to match new background
          backgroundColor: '#e8e6e1', // Slightly darker than main background for visual separation
        }}
      >
        <button
          onClick={handleDelete}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#ffffff',
            backgroundColor: '#EF4444', // red-500
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Remove Node from Workflow
        </button>
        <p
          style={{
            fontSize: '12px',
            color: '#64748B', // Darker text for better contrast
            margin: '8px 0 0 0',
            textAlign: 'center',
          }}
        >
          This action cannot be undone
        </p>
      </div>
    </div>
  );
}
