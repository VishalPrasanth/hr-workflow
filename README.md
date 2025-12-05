# HR Workflow Designer (Mini HR Workflow Builder)

A visual, interactive workflow builder for HR teams — built using **React**, **TypeScript**, **React Flow**, and a **mock JSON-server backend**.

This tool allows an HR admin to **design**, **configure**, **validate**, **simulate**, **export**, and **import** internal workflows such as onboarding, leave approval, or document verification.

---

# 🌟 Features (Current Implementation)

## 🧱 Workflow Canvas
- Drag-and-drop workflow nodes onto the canvas  
- Click-to-add nodes from the sidebar  
- Move nodes freely (React Flow)  
- Connect nodes with edges  
- Minimap, zoom in/out, fit view

## 🧩 Node Types Implemented
Each node type includes a fully functional configuration panel:

### **1. Start Node**
- Start title  
- Optional metadata key–value pairs  

### **2. Task Node**
- Title  
- Description  
- Assignee  
- Due date  
- Custom fields (dynamic key–value inputs)

### **3. Approval Node**
- Title  
- Approver role (Manager / HRBP / Director)  
- Auto-approve threshold  

### **4. Automated Step Node**
- Title  
- Select an automation action (fetched from JSON-server)  
- Dynamic action parameters  
- Auto-saved per-action configurations  

### **5. End Node**
- End message  
- Summary flag checkbox  

Each node updates React Flow state and persists values reliably.

---

# 🧮 Workflow Validation Engine
Custom validation checks:

- ✔ Exactly one **Start** node required  
- ✔ At least one **End** node suggested  
- ✔ Detects **isolated nodes**  
- ✔ Detects **unconnected sequences**  
- ✔ Displays **errors and warnings** in a clean console panel  

---

# 🚀 Workflow Simulation (Mock API)
Uses a JSON-server `/simulate` endpoint.

- Walks workflow logically (start → middle → end)
- Produces step-by-step execution logs:
  - `✓ Executed start node "Start"`
  - `✓ Executed task node "Task"`
  - `• Skipped node without outgoing edges`
- Shows results in the bottom execution console

---

## 🖥 Mock Backend (Express + JSON Data)

Although JSON-server is included, this project uses a **custom Express backend** because
the assignment requires a programmable `/simulate` endpoint.

### 📌 server.js Overview
The backend provides:

#### **GET /automations**
Returns mock automated actions:
```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]


## POST /simulate

Accepts workflow JSON and returns execution steps, e.g.:

{
  "valid": true,
  "errors": [],
  "steps": [
    { "id": 1, "nodeId": "node-1", "type": "start", "status": "ok", "message": "Executed start node" }
  ]
}

Running Backend
npm run api


This starts:

http://localhost:3001

Postman Testing

GET → http://localhost:3001/automations

POST → http://localhost:3001/simulate

Body → Raw JSON → { nodes: [], edges: [] }
---

# 🔄 Import / Export Workflow (JSON)
From the console:

### ✔ **Export Workflow**
Downloads a `.json` file containing:
```json
{
  "nodes": [...],
  "edges": [...]
}
