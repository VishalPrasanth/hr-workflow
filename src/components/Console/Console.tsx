import React from 'react';
import type { WorkflowValidationError } from '../../workflow/validation';
import type { SimulationResult } from '../../api/mockapi';

type ConsoleProps = {
  validationErrors: WorkflowValidationError[];
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  onValidate: () => void;
  onRunSimulation: () => void;
  onExportWorkflow: () => void;
  onImportWorkflow: () => void;
};

export const Console: React.FC<ConsoleProps> = ({
  validationErrors,
  simulationResult,
  isSimulating,
  onValidate,
  onRunSimulation,
  onExportWorkflow,
  onImportWorkflow,
}) => {
  // Remove unused variables to fix lint warnings
  
  return (
    <div style={styles.consoleContainer}>
      {/* Action Buttons */}
      <div style={styles.actionsBar}>
        <button 
          onClick={onValidate} 
          style={{
            ...styles.button,
            ...styles.secondaryButton,
          }}
        >
          Validate Workflow
        </button>
        
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          style={{
            ...styles.button,
            ...styles.primaryButton,
            opacity: isSimulating ? 0.7 : 1,
          }}
        >
          {isSimulating ? (
            <span style={styles.buttonContent}>
              <span className="spinner" style={styles.spinner} />
              Simulating...
            </span>
          ) : (
            'Run Simulation'
          )}
        </button>

        <button
          onClick={onExportWorkflow}
          style={{
            ...styles.button,
            ...styles.secondaryButton,
          }}
        >
          Export JSON
        </button>

        <button
          onClick={onImportWorkflow}
          style={{
            ...styles.button,
            ...styles.secondaryButton,
          }}
        >
          Import JSON
        </button>
      </div>


      {/* Validation Status */}
      <div style={styles.section}>
        {validationErrors.length === 0 ? (
          <div style={styles.successMessage}>
            ✓ No validation errors. Workflow looks good.
          </div>
        ) : (
          <ul style={styles.validationList}>
            {validationErrors.map((error, idx) => (
              <li 
                key={idx} 
                style={{
                  ...styles.validationItem,
                  color: error.type === 'error' ? '#FF4444' : '#FFCC33',
                }}
              >
                {error.type === 'error' ? '✗' : '!'} {error.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Execution Log */}
      {simulationResult && (
        <div style={styles.section}>
          <div style={styles.logHeader}>Execution Log</div>
          <div style={styles.logContainer}>
            {simulationResult.steps.map((step, idx) => {
              const statusSymbol = step.status === 'ok' ? '✓' : step.status === 'error' ? '✗' : '•';
              const statusColor = step.status === 'ok' ? '#00FF66' : step.status === 'error' ? '#FF4444' : '#E0E0E0';
              const stepStyle = { ...styles.logItem, color: statusColor };
              
              return (
                <div key={idx} style={stepStyle}>
                  {statusSymbol} Step {step.id} [{step.type}] → {step.message}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  consoleContainer: {
    backgroundColor: '#000',
    color: '#00FF66',
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '12px',
    borderTop: '1px solid #333',
    height: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    
  },
  actionsBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  button: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    fontFamily: 'monospace',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#333',
    color: 'white',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  spinner: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 1s ease-in-out infinite',
  },
  section: {
    marginBottom: '12px',
  },
  successMessage: {
    color: '#00FF66',
    padding: '4px 0',
  },
  validationList: {
    listStyle: 'none',
    padding: 0,
    margin: '4px 0 0 0',
  },
  validationItem: {
    padding: '2px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logHeader: {
    color: '#00FF66',
    fontWeight: 'bold',
    marginBottom: '6px',
    borderBottom: '1px solid #333',
    paddingBottom: '4px',
  },
  logContainer: {
    backgroundColor: '#0A0A0A',
    borderRadius: '4px',
    padding: '8px',
    maxHeight: '100px',
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#E0E0E0',
  },
  logItem: {
    padding: '2px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
} as const;

// Add CSS for the spinner animation
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);
