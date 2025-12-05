import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';

type Props = {
  node: Node;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
};

export function EndNodeForm({ node, onUpdateNodeData }: Props) {
  const data: any = node.data || {};
  const endMessage: string = data.endMessage ?? '';
  const summaryFlag: boolean = Boolean(data.summaryFlag);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { endMessage: e.target.value });
  };

  const handleSummaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { summaryFlag: e.target.checked });
  };

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>End Message</label>
        <input
          type="text"
          value={endMessage}
          onChange={handleMessageChange}
          placeholder="Onboarding completed"
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <input
          type="checkbox"
          checked={summaryFlag}
          onChange={handleSummaryChange}
        />
        Include this step in workflow summary
      </label>
    </div>
  );
}
