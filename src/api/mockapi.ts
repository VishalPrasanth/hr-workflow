export type AutomationAction = {
  id: string;
  label: string;
  params: string[];
};

export type SimulationStep = {
  id: number;
  nodeId: string;
  label: string;
  type: string;
  status: 'ok' | 'skipped' | 'error';
  message: string;
};

export type SimulationResult = {
  valid: boolean;
  errors: string[];
  steps: SimulationStep[];
};

// Base URL for json-server backend
const API_BASE = 'http://localhost:3001';

// GET /automations
export async function getAutomations(): Promise<AutomationAction[]> {
  const res = await fetch(`${API_BASE}/automations`);

  if (!res.ok) {
    throw new Error(`Failed to fetch automations: ${res.status}`);
  }

  const data = await res.json();
  return data as AutomationAction[];
}

// POST /simulate
export async function simulateWorkflow(workflow: {
  nodes: any[];
  edges: any[];
}): Promise<SimulationResult> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(workflow)
  });

  if (!res.ok) {
    throw new Error(`Failed to simulate workflow: ${res.status}`);
  }

  const data = await res.json();
  return data as SimulationResult;
}

