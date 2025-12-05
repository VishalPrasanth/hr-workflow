import { useState, useCallback } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type NodeMouseHandler,
} from '@xyflow/react';

import { Sidebar } from './components/SideBar/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas/WorkflowCanvas';
import { NodeDetailsPanel } from './components/NodeDetailsPanel/NodeDetailsPanel';
import { Console } from './components/Console/Console';

import { validateWorkflow, type WorkflowValidationError } from './workflow/validation';
import { simulateWorkflow, type SimulationResult } from './api/mockapi';

export type NodeKind = 'start' | 'task' | 'approval' | 'automated' | 'end';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = []; // start empty

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<WorkflowValidationError[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // -----------------------------------------------------------
  // VALIDATION
  // -----------------------------------------------------------
  const handleValidateWorkflow = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    setValidationErrors(result);
    return result;
  }, [nodes, edges]);

  // -----------------------------------------------------------
  // SIMULATION
  // -----------------------------------------------------------
  const handleRunSimulation = useCallback(async () => {
    const validation = handleValidateWorkflow();
    const hasError = validation.some((e) => e.type === 'error');
    if (hasError) return; // block simulation

    setIsSimulating(true);
    try {
      const result = await simulateWorkflow({ nodes, edges });
      setSimulationResult(result);
    } catch (err) {
      setSimulationResult(null);
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges]);

  const handleExportWorkflow = useCallback(() => {
  const payload = {
    nodes,
    edges,
  };

  const json = JSON.stringify(payload, null, 2);
  console.log('Exported workflow JSON:', json);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(json)
      .then(() => {
        alert('Workflow JSON copied to clipboard.');
      })
      .catch(() => {
        alert('Could not copy to clipboard. Check console for the JSON.');
      });
  } else {
    alert('Clipboard not available. Check console for the exported JSON.');
  }
}, [nodes, edges]);

const handleImportWorkflow = useCallback(() => {
  const input = window.prompt('Paste workflow JSON here:');
  if (!input) return;

  try {
    const parsed = JSON.parse(input);

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      alert('Invalid JSON. Expected an object with "nodes" and "edges" arrays.');
      return;
    }

    const nextNodes = parsed.nodes as Node[];
    const nextEdges = parsed.edges as Edge[];

    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(null);
    setValidationErrors([]);
    setSimulationResult(null);

    alert('Workflow imported successfully.');
  } catch (err) {
    console.error('Failed to import workflow JSON:', err);
    alert('Invalid JSON. See console for details.');
  }
}, [setNodes, setEdges]);


  // -----------------------------------------------------------
  // CREATE NODE (button click)
  // -----------------------------------------------------------
  const handleAddNode = useCallback(
    (kind: NodeKind) => {
      const lastNode = nodes[nodes.length - 1];
      const position = lastNode
        ? { x: lastNode.position.x + 100, y: lastNode.position.y + 50 }
        : { x: 100, y: 100 };

      let data: any;
      switch (kind) {
        case 'start':
          data = { type: 'start', label: 'Start', title: 'Start', metadata: [] };
          break;
        case 'task':
          data = {
            type: 'task',
            label: 'Task',
            title: 'Task',
            description: '',
            assignee: '',
            dueDate: '',
            customFields: [],
          };
          break;
        case 'approval':
          data = {
            type: 'approval',
            label: 'Approval',
            title: 'Approval',
            approverRole: '',
            autoApproveThreshold: 0,
          };
          break;
        case 'automated':
          data = {
            type: 'automated',
            label: 'Automated Step',
            title: 'Automated Step',
            actionId: '',
            params: {},
            savedParams: {},
          };
          break;
        case 'end':
          data = {
            type: 'end',
            label: 'End',
            endMessage: 'Workflow completed',
            summaryFlag: false,
          };
          break;
      }

      const newNode: Node = {
        id: `node-${Date.now()}`,
        position,
        data,
        type: 'default',
      };

      setNodes((prev) => [...prev, newNode]);
    },
    [nodes]
  );

  // -----------------------------------------------------------
  // DRAG + DROP CREATE NODE
  // -----------------------------------------------------------
  const handleDropNode = useCallback(
    (kind: NodeKind, position: { x: number; y: number }) => {
      let data: any;
      switch (kind) {
        case 'start':
          data = { type: 'start', label: 'Start', title: 'Start', metadata: [] };
          break;
        case 'task':
          data = {
            type: 'task',
            label: 'Task',
            title: 'Task',
            description: '',
            assignee: '',
            dueDate: '',
            customFields: [],
          };
          break;
        case 'approval':
          data = {
            type: 'approval',
            label: 'Approval',
            title: 'Approval',
            approverRole: '',
            autoApproveThreshold: 0,
          };
          break;
        case 'automated':
          data = {
            type: 'automated',
            label: 'Automated Step',
            title: 'Automated Step',
            actionId: '',
            params: {},
            savedParams: {},
          };
          break;
        case 'end':
          data = {
            type: 'end',
            label: 'End',
            endMessage: 'Workflow completed',
            summaryFlag: false,
          };
          break;
      }

      const newNode: Node = {
        id: `node-${Date.now()}`,
        position,
        data,
        type: 'default',
      };

      setNodes((prev) => [...prev, newNode]);
    },
    []
  );

  // -----------------------------------------------------------
  // UPDATE NODE DATA
  // -----------------------------------------------------------
  const updateNodeData = useCallback(
    (id: string, patch: Record<string, unknown>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...patch } }
            : node
        )
      );
    },
    []
  );

  // -----------------------------------------------------------
  // DELETE NODE
  // -----------------------------------------------------------
  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId((sel) => (sel === id ? null : sel));
  }, []);

  // -----------------------------------------------------------
  // REACT FLOW HANDLERS
  // -----------------------------------------------------------
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((snapshot) => applyNodeChanges(changes, snapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((snapshot) => addEdge(params, snapshot)),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) || null
    : null;

  // -----------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------
  return (
    <div style={{ 
      display: 'flex',
      height: '100%',
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Sidebar */}
      <div style={{ flexShrink: 0 }}>
        <Sidebar 
          onAddNode={handleAddNode}
          onImportWorkflow={handleImportWorkflow}
          onExportWorkflow={handleExportWorkflow}
          showConsole={showConsole}
          onToggleConsole={() => setShowConsole(!showConsole)}
          // isCollapsed={isSidebarCollapsed}
          // onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Workflow Canvas */}
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlowProvider>
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onDropNode={handleDropNode}
            />
          </ReactFlowProvider>
        </div>

        {/* Console Panel */}
        {showConsole && (
          <div style={{
            height: '200px',
            backgroundColor: '#1a1a1a',
            borderTop: '1px solid #333',
            overflow: 'auto'
          }}>
            <Console
              validationErrors={validationErrors}
              simulationResult={simulationResult}
              isSimulating={isSimulating}
              onValidate={handleValidateWorkflow}
              onRunSimulation={handleRunSimulation}
            />
          </div>
        )}
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <div style={{ flexShrink: 0, width: '250px' }}>
          <NodeDetailsPanel
            node={selectedNode}
            onUpdateNodeData={updateNodeData}
            onDeleteNode={deleteNode}
          />
        </div>
      )}
    </div>
  );
}
