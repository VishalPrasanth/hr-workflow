import { useEffect, useState } from 'react';
import type { Node } from '@xyflow/react';
import type { ChangeEvent } from 'react';
import {
  getAutomations,
  type AutomationAction,
} from '../../api/mockapi';

type Props = {
  node: Node;
  onUpdateNodeData: (id: string, dataPatch: Record<string, unknown>) => void;
};

export function AutomatedNodeForm({ node, onUpdateNodeData }: Props) {
  const data: any = node.data || {};
  const title: string = data.title ?? '';
  const actionId: string = data.actionId ?? '';

  // current params for the selected action
  const params: Record<string, string> = data.params ?? {};
  // saved params per action
  const savedParams: Record<string, Record<string, string>> =
    data.savedParams ?? {};

  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load available automations from mock API
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const result = await getAutomations();
        if (!isMounted) return;
        setActions(result);
      } catch (err) {
        if (!isMounted) return;
        setLoadError('Failed to load automations.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeData(node.id, { title: e.target.value });
  };

  const handleActionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextActionId = e.target.value;
    const action = actions.find((a) => a.id === nextActionId);

    if (!action) {
      // no known action -> reset params but keep savedParams as-is
      onUpdateNodeData(node.id, {
        actionId: nextActionId,
        params: {},
        savedParams,
      });
      return;
    }

    // if we have saved params for this action, reuse them
    const previouslySaved = savedParams[nextActionId] || {};

    const nextParams: Record<string, string> = {};
    action.params.forEach((key) => {
      nextParams[key] = previouslySaved[key] ?? '';
    });

    onUpdateNodeData(node.id, {
      actionId: nextActionId,
      params: nextParams,
      savedParams: {
        ...savedParams,
        [nextActionId]: nextParams,
      },
    });
  };

  const handleParamChange = (key: string, value: string) => {
    const updatedParams = {
      ...params,
      [key]: value,
    };

    // update savedParams for the current action as well
    const currentActionId = actionId || '__no_action__';

    onUpdateNodeData(node.id, {
      params: updatedParams,
      savedParams: {
        ...savedParams,
        [currentActionId]: updatedParams,
      },
    });
  };

  const selectedAction = actions.find((a) => a.id === actionId);

  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Automated Step Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Send welcome email"
          style={{ padding: 6, fontSize: 13 }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontSize: 12, fontWeight: 500 }}>Action</label>
        {loading ? (
          <span style={{ fontSize: 11, color: '#777' }}>Loading actions...</span>
        ) : loadError ? (
          <span style={{ fontSize: 11, color: '#c62828' }}>{loadError}</span>
        ) : (
          <select
            value={actionId}
            onChange={handleActionChange}
            style={{ padding: 6, fontSize: 13 }}
          >
            <option value="">Select action</option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedAction && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>Action Parameters</span>
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {selectedAction.params.map((key) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <label style={{ fontSize: 11 }}>{key}</label>
                <input
                  type="text"
                  value={params[key] ?? ''}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  style={{ padding: 6, fontSize: 13 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !loadError && !selectedAction && (
        <p style={{ fontSize: 11, color: '#777' }}>
          Select an action to configure its parameters.
        </p>
      )}
    </div>
  );
}
