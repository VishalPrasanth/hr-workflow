// // src/api/mockApi.ts

// // Types for our mock API
// export type AutomationAction = {
//   id: string;
//   label: string;
//   params: string[];
// };

// export type SimulationStep = {
//   id: number;
//   nodeId: string;
//   label: string;
//   type: string;
//   status: 'ok' | 'skipped' | 'error';
//   message: string;
// };

// export type SimulationResult = {
//   valid: boolean;
//   errors: string[];
//   steps: SimulationStep[];
// };

// // Mock data for /automations
// const AUTOMATIONS: AutomationAction[] = [
//   {
//     id: 'send_email',
//     label: 'Send Email',
//     params: ['to', 'subject'],
//   },
//   {
//     id: 'generate_doc',
//     label: 'Generate Document',
//     params: ['template', 'recipient'],
//   },
// ];

// // Simulate GET /automations
// export async function getAutomations(): Promise<AutomationAction[]> {
//   // small delay to feel like a real API
//   await new Promise((resolve) => setTimeout(resolve, 200));
//   return AUTOMATIONS;
// }

// // Simulate POST /simulate
// // For now we just walk the nodes in a simple order and generate a fake log.
// export async function simulateWorkflow(workflow: {
//   nodes: any[];
//   edges: any[];
// }): Promise<SimulationResult> {
//   const { nodes, edges } = workflow;

//   const errors: string[] = [];
//   if (!Array.isArray(nodes) || nodes.length === 0) {
//     errors.push('No nodes found in workflow.');
//   }

//   // Very simple "ordering":
//   // 1. all start nodes
//   // 2. all non-start/end nodes
//   // 3. all end nodes
//   const getKind = (node: any) => node?.data?.type ?? node?.data?.kind;
//   const starts = nodes.filter((n: any) => getKind(n) === 'start');
//   const ends = nodes.filter((n: any) => getKind(n) === 'end');
//   const middles = nodes.filter(
//     (n: any) => getKind(n) !== 'start' && getKind(n) !== 'end',
//   );

//   const ordered = [...starts, ...middles, ...ends];

//   const steps: SimulationStep[] = ordered.map((node: any, index: number) => {
//     const kind = getKind(node) ?? 'unknown';
//     const label = node?.data?.label ?? node?.data?.title ?? node.id;
//     const hasOutgoing = edges.some((e: any) => e.source === node.id);
//     const status: 'ok' | 'skipped' = hasOutgoing || kind === 'end' ? 'ok' : 'skipped';

//     return {
//       id: index + 1,
//       nodeId: node.id,
//       label,
//       type: kind,
//       status,
//       message:
//         status === 'ok'
//           ? `Executed ${kind} node "${label}".`
//           : `Node "${label}" has no outgoing edges; stopping here.`,
//     };
//   });

//   const valid = errors.length === 0;

//   // small delay to mimic network
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   return {
//     valid,
//     errors,
//     steps,
//   };
// }

// src/api/mockApi.ts

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

