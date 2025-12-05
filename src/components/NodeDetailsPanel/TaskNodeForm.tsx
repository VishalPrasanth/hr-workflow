import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';

type Props = {
  node: Node;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
};

export function TaskNodeForm({ node, onUpdateNodeData }: Props) {
  const data: any = node.data || {};
  const title: string = data.title ?? '';
  const description: string = data.description ?? '';
  const assignee: string = data.assignee ?? '';
  const dueDate: string = data.dueDate ?? '';
  const customFields: { key: string; value: string }[] = data.customFields ?? [];

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateNodeData(node.id, { description: e.target.value });
  };

  const handleAssigneeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { assignee: e.target.value });
  };

  const handleDueDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { dueDate: e.target.value });
  };

  const handleCustomFieldKeyChange = (index: number, value: string) => {
    const next = [...customFields];
    next[index] = { ...next[index], key: value };
    onUpdateNodeData(node.id, { customFields: next });
  };

  const handleCustomFieldValueChange = (index: number, value: string) => {
    const next = [...customFields];
    next[index] = { ...next[index], value };
    onUpdateNodeData(node.id, { customFields: next });
  };

  const handleAddCustomField = () => {
    const next = [...customFields, { key: '', value: '' }];
    onUpdateNodeData(node.id, { customFields: next });
  };

  const handleRemoveCustomField = (index: number) => {
    const next = customFields.filter((_, i) => i !== index);
    onUpdateNodeData(node.id, { customFields: next });
  };

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Task Title *</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Collect documents"
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Description</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          rows={3}
          style={{ padding: 6, fontSize: 13, resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Assignee</label>
        <input
          type="text"
          value={assignee}
          onChange={handleAssigneeChange}
          placeholder="e.g., HR Executive"
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
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
          <span style={{ fontSize: 12, fontWeight: 500 }}>Custom Fields (optional)</span>
          <button
            type="button"
            onClick={handleAddCustomField}
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

        {customFields.length === 0 && (
          <p style={{ fontSize: 11, color: '#777' }}>
            No custom fields yet. Use this for extra data like “priority” or “document type”.
          </p>
        )}

        {customFields.map((item, index) => (
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
              onChange={(e) => handleCustomFieldKeyChange(index, e.target.value)}
              style={{ padding: 4, fontSize: 12, flex: 1 }}
            />
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => handleCustomFieldValueChange(index, e.target.value)}
              style={{ padding: 4, fontSize: 12, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => handleRemoveCustomField(index)}
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
