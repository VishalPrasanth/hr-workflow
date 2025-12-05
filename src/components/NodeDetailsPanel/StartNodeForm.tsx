import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';

type Props = {
  node: Node;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
};

export function StartNodeForm({ node, onUpdateNodeData }: Props) {
  const data: any = node.data || {};
  const title: string = data.title ?? '';
  const metadata: { key: string; value: string }[] = data.metadata ?? [];

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { title: e.target.value });
  };

  const handleMetadataKeyChange = (index: number, value: string) => {
    const next = [...metadata];
    next[index] = { ...next[index], key: value };
    onUpdateNodeData(node.id, { metadata: next });
  };

  const handleMetadataValueChange = (index: number, value: string) => {
    const next = [...metadata];
    next[index] = { ...next[index], value };
    onUpdateNodeData(node.id, { metadata: next });
  };

  const handleAddMetadata = () => {
    const next = [...metadata, { key: '', value: '' }];
    onUpdateNodeData(node.id, { metadata: next });
  };

  const handleRemoveMetadata = (index: number) => {
    const next = metadata.filter((_, i) => i !== index);
    onUpdateNodeData(node.id, { metadata: next });
  };

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Start Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500 }}>Metadata (optional)</span>
          <button
            type="button"
            onClick={handleAddMetadata}
            style={{
              fontSize: 11,
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            + Add
          </button>
        </div>

        {metadata.length === 0 && (
          <p style={{ fontSize: 11, color: '#777' }}>
            No metadata yet. Click <strong>+ Add</strong> to add key-value pairs.
          </p>
        )}

        {metadata.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: 4,
              marginBottom: 4,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Key"
              value={item.key}
              onChange={(e) => handleMetadataKeyChange(index, e.target.value)}
              style={{ padding: 4, fontSize: 12, flex: 1 }}
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleMetadataValueChange(index, e.target.value)}
              style={{ padding: 4, fontSize: 12, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => handleRemoveMetadata(index)}
              style={{
                fontSize: 11,
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #e33',
                backgroundColor: '#fdd',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
