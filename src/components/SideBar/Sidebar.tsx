import React from "react";

type NodeKind = "start" | "task" | "approval" | "automated" | "end";

type NodeItem = {
  id: NodeKind;
  label: string;
  description: string;
  color: string;
};

type SidebarProps = {
  onAddNode: (kind: NodeKind) => void;
  onImportWorkflow: () => void;
  onExportWorkflow: () => void;
  showConsole: boolean;
  onToggleConsole: () => void;
};

const NODES: NodeItem[] = [
  {
    id: "start",
    label: "Start",
    description: "Begin your workflow here",
    color: "#10B981", 
  },
  {
    id: "task",
    label: "Task",
    description: "A manual task step",
    color: "#3B82F6", 
  },
  {
    id: "approval",
    label: "Approval",
    description: "Requires manual approval",
    color: "#F59E0B", 
  },
  {
    id: "automated",
    label: "Automated",
    description: "Runs automatically",
    color: "#8B5CF6", 
  },
  {
    id: "end",
    label: "End",
    description: "Finish the workflow",
    color: "#EF4444", 
  },
];

const sidebarStyle: React.CSSProperties = {
  width: "250px",
  height: "100%",
  backgroundColor: "#f4f3ee", 
  color: "#1E293B", 
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  borderRight: "1px solid #d9d7d0", 
};


const nodeItemStyle = (
  color: string,
  isHovered = false
): React.CSSProperties => ({
  backgroundColor: isHovered ? "rgba(0, 0, 0, 0.05)" : "#e8e6e1",
  borderLeft: `4px solid ${color}`,
  borderRadius: "6px",
  padding: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
});

export function Sidebar({
  onAddNode,
  onImportWorkflow,
  onExportWorkflow,
  showConsole,
  onToggleConsole,
}: SidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isNodesOpen, setIsNodesOpen] = React.useState(true);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    kind: NodeKind
  ) => {
    
    event.dataTransfer.setData("application/reactflow", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "4px",
            color: "#1E293B",
          }}
        >
          HR Workflow Automation
        </h2>
        <p style={{ fontSize: "13px", color: "#475569", marginBottom: "12px" }}>
          Click or drag nodes onto the canvas to build a workflow.
        </p>
      </div>

      <div
        style={{
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Working Nodes Dropdown */}
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={() => setIsNodesOpen(!isNodesOpen)}
            style={{
              ...nodeItemStyle("#6B7280"),
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              backgroundColor: isNodesOpen ? "#d9d7d0" : "#e8e6e1",
              marginBottom: "8px",
            }}
          >
            <span>Working Nodes</span>
            <span
              style={{
                transition: "transform 0.2s",
                transform: isNodesOpen ? "rotate(180deg)" : "none",
              }}
            >
              ▼
            </span>
          </button>

          {isNodesOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                paddingLeft: "8px",
                borderLeft: "2px solid #d9d7d0",
                marginLeft: "8px",
              }}
            >
              {NODES.map((node) => (
                <div
                  key={node.id}
                  style={{
                    ...nodeItemStyle(node.color, hoveredNode === node.id),
                    cursor: "pointer",
                  }}
                  draggable
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onDragStart={(e) => onDragStart(e, node.id)}
                  onClick={() => onAddNode(node.id)}
                >
                  <div style={{ fontWeight: 500, color: "#1E293B" }}>
                    {node.label}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      marginTop: "4px",
                    }}
                  >
                    {node.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "12px",
          borderTop: "1px solid #d9d7d0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <button
            onClick={toggleDropdown}
            style={{
              ...nodeItemStyle("#6B7280"),
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              backgroundColor: isDropdownOpen ? "#d9d7d0" : "#e8e6e1",
            }}
          >
            <span>Configure as JSON</span>
            <span
              style={{
                transition: "transform 0.2s",
                transform: isDropdownOpen ? "rotate(180deg)" : "none",
              }}
            >
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: "relative",
                marginTop: "4px",
                backgroundColor: "#f8f7f5",
                borderRadius: "6px",
                border: "1px solid #d9d7d0",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
              }}
            >
              <button
                onClick={() => {
                  onImportWorkflow();
                  setIsDropdownOpen(false);
                }}
                style={{
                  ...nodeItemStyle("#3B82F6"),
                  width: "100%",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: "1px solid #d9d7d0",
                  textAlign: "left",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              >
                Import JSON
              </button>
              <button
                onClick={() => {
                  onExportWorkflow();
                  setIsDropdownOpen(false);
                }}
                style={{
                  ...nodeItemStyle("#10B981"),
                  width: "100%",
                  borderRadius: 0,
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              >
                Export JSON
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onToggleConsole}
          style={{
            ...nodeItemStyle(showConsole ? "#4CAF50" : "#6B7280"),
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
          }}
        >
          <span>Simulation Console</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: showConsole ? "#4CAF50" : "transparent",
              border: `1px solid ${showConsole ? "#4CAF50" : "#d1d5db"}`,
              color: showConsole ? "white" : "#6B7280",
              fontSize: "12px",
              transition: "all 0.2s ease",
            }}
          >
            {showConsole ? "✓" : ">"}
          </span>
        </button>

        <p style={{ fontSize: "14px", color: "#64748B", fontStyle: "italic" }}>
          Tip: To Run Simulation Please run the below command in IDE Terminal
          to simulate. Use Postman for Api testing refer README.
        </p>
        <p style={{ fontSize: "14px", color: "#64748B", fontStyle: "italic" }}>
          npm run api
        </p>
      </div>
    </div>
  );
}
