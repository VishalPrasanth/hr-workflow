import type { Node, Edge } from '@xyflow/react';

export type WorkflowValidationError = {
  type: 'error' | 'warning';
  message: string;
};

function getNodeKind(node: Node): string | undefined {
  const data: any = node.data || {};
  return data.type ?? data.kind;
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): WorkflowValidationError[] {
  const errors: WorkflowValidationError[] = [];

  if (nodes.length === 0) {
    errors.push({
      type: 'warning',
      message: 'The workflow is empty. Add some nodes to get started.',
    });
    return errors;
  }

  const startNodes = nodes.filter((n) => getNodeKind(n) === 'start');
  const endNodes = nodes.filter((n) => getNodeKind(n) === 'end');

  // Start node checks
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'No Start node found. Add a Start node to define the entry point.',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: 'error',
      message: `Multiple Start nodes found (${startNodes.length}). There should be exactly one entry point.`,
    });
  }

  // End node checks
  if (endNodes.length === 0) {
    errors.push({
      type: 'warning',
      message: 'No End node found. Consider adding an End node to mark workflow completion.',
    });
  }

  // Connectivity: nodes with no incoming and no outgoing edges
  if (nodes.length > 0) {
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      if (e.source) connectedNodeIds.add(e.source);
      if (e.target) connectedNodeIds.add(e.target);
    });

    const isolatedNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));

    isolatedNodes.forEach((node) => {
      const kind = getNodeKind(node) ?? 'unknown';
      errors.push({
        type: 'warning',
        message: `Node "${(node.data as any)?.label ?? node.id}" (${kind}) is not connected to the workflow.`,
      });
    });
  }

  return errors;
}
