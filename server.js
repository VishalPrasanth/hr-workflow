// server.js - lightweight Express mock API (ESM, works with "type": "module")

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ---- Mock data for GET /automations ----
const automations = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject']
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient']
  }
];

// GET /automations
app.get('/automations', (req, res) => {
  res.json(automations);
});

// ---- Simulation logic (similar to your front-end mock) ----
function simulate(workflow) {
  const nodes = Array.isArray(workflow?.nodes) ? workflow.nodes : [];
  const edges = Array.isArray(workflow?.edges) ? workflow.edges : [];

  const getKind = (node) => node?.data?.type || node?.data?.kind || 'unknown';

  const starts = nodes.filter((n) => getKind(n) === 'start');
  const ends = nodes.filter((n) => getKind(n) === 'end');
  const middles = nodes.filter(
    (n) => getKind(n) !== 'start' && getKind(n) !== 'end'
  );

  const ordered = [...starts, ...middles, ...ends];

  const steps = ordered.map((node, index) => {
    const kind = getKind(node);
    const label = node?.data?.label || node?.data?.title || node.id;
    const hasOutgoing = edges.some((e) => e.source === node.id);

    const status = hasOutgoing || kind === 'end' ? 'ok' : 'skipped';

    return {
      id: index + 1,
      nodeId: node.id,
      label,
      type: kind,
      status,
      message:
        status === 'ok'
          ? `Executed ${kind} node "${label}".`
          : `Node "${label}" has no outgoing edges; stopping here.`
    };
  });

  let valid = true;
  const errors = [];

  if (nodes.length === 0) {
    valid = false;
    errors.push('No nodes found in workflow.');
  }

  return {
    valid,
    errors,
    steps
  };
}

// POST /simulate
app.post('/simulate', (req, res) => {
  try {
    const workflow = req.body;
    const result = simulate(workflow);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error in /simulate:', err);
    res.status(500).json({
      valid: false,
      errors: ['Internal error while simulating workflow.'],
      steps: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server is running on http://localhost:${PORT}`);
});
