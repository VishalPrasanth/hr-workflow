import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';

type Props = {
  node: Node;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
};

export function ApprovalNodeForm({ node, onUpdateNodeData }: Props) {
  const data: any = node.data || {};
  const title: string = data.title ?? '';
  const approverRole: string = data.approverRole ?? '';
  const autoApproveThreshold: number = data.autoApproveThreshold ?? 0;

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { title: e.target.value });
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onUpdateNodeData(node.id, { approverRole: e.target.value });
  };

  const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onUpdateNodeData(node.id, { autoApproveThreshold: Number.isNaN(value) ? 0 : value });
  };

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Approval Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Manager approval"
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Approver Role</label>
        <select
          value={approverRole}
          onChange={handleRoleChange}
          style={{ padding: 6, fontSize: 13 }}
        >
          <option value="">Select role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Auto-approve Threshold</label>
        <input
          type="number"
          value={autoApproveThreshold}
          onChange={handleThresholdChange}
          placeholder="0"
          style={{ padding: 6, fontSize: 13 }}
        />
        <p style={{ fontSize: 11, color: '#777' }}>
          Optional: automatically approve if value is below this threshold.
        </p>
      </div>
    </div>
  );
}
