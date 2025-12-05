# HR Workflow Automation

Welcome, Tredence Associate! 
Thank you so much for visiting my GitHub. I sincerely appreciate your time and consideration, and I’d be truly grateful for the opportunity to be part of Tredence.

# Assignment Overview

A visual, interactive workflow builder for HR teams, built using **React**, **TypeScript**, **React Flow**, and a **mock JSON-server backend**.

This tool allows an HR admin to **design**, **configure**, **validate**, **simulate**, **export**, and **import** internal workflows such as onboarding, leave approval, or document verification.

# This project demonstrates:

- Deep React & React Flow knowledge

- Modular and scalable architecture

- Rich, dynamic node configuration forms

- Mock API integration (JSON server + Express)

- Workflow simulation sandbox

- JSON Import & Export support

---

# 🧪 How to Run & Test
1️⃣ Install
```npm install```

2️⃣ Start Frontend
```npm run dev```

3️⃣ Start Mock API Server
```npm run api```

---

# Project Architecture

![Image Alt](https://github.com/VishalPrasanth/hr-workflow/blob/67e53266c5dbb1e7916236112484dd2c21d13eeb/public/Folder%20Architecture.jpg)

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

 ![Image Alt](https://github.com/VishalPrasanth/hr-workflow/blob/181eba95cea3e3dd741e5bf0bb1959a537e2dfa9/public/Get%20Request.jpg)


## POST /simulate

Accepts workflow JSON and returns execution steps, e.g.:

![Image Alt](https://github.com/VishalPrasanth/hr-workflow/blob/181eba95cea3e3dd741e5bf0bb1959a537e2dfa9/public/POST%20Request.jpg)


### Running Backend
npm run api


This starts:

```http://localhost:3001```

Postman Testing

```GET → http://localhost:3001/automations```

```POST → http://localhost:3001/simulate```

```Body → Raw JSON → { nodes: [], edges: [] }```


# 🔄 Import / Export Workflow (JSON)
From the console:

### ✔ **Export Workflow**
Downloads a `.json` file containing:

`{
  "nodes": [...],
  "edges": [...]
}`

---

# 🧠 Architecture Notes & Design Choices
🧩 Modular Node Forms

Each node type has its own React component.
This keeps the panel scalable - adding a new node type is trivial.

🔗 Canvas & Sidebar Separation

Canvas manages only graph state.
Sidebar only manages node creation.
Clear responsibility division.

🌐 API abstraction

The app never calls fetch directly
API communication goes through /src/api/mockapi.ts.

This makes future replacements (Axios, real backend, MSW) easy.

🔍 Validation Layer

Validation is separated in /workflow/validation.ts, enabling:

Structural validation

Graph rules

Future cycle detection

# 🎛 Scalable UI

Components are decoupled so UI libraries can be added later with no rewrites.

