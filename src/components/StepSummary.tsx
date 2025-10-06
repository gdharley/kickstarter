import React from 'react';

type WizardStep = {
  id: string;
  title: string;
  description: string;
  type: string;
  options: Array<{ value: string; label: string; description: string }>;
};

type StepSummaryProps = {
  steps: WizardStep[];
  answers: Record<string, string>;
  handleExportJSON: () => void;
  handleExportMarkdown: () => void;
};

const StepSummary: React.FC<StepSummaryProps> = ({ steps, answers, handleExportJSON, handleExportMarkdown }) => {
  // Find the summary step for its description
  const summaryStep = steps.find((s) => s.type === 'summary');
  return (
    <div style={{ width: '100%' }}>
      <h2 className="text-primary" style={{ marginBottom: 24, fontSize: '1.5rem' }}>Summary</h2>
      {summaryStep && summaryStep.description && (
        <div className="wizard-description-panel panel-neutral" style={{ width: '100%', marginBottom: 16, padding: '16px' }}>
          <div
            className="text-primary"
            style={{ fontSize: '1.1rem' }}
            dangerouslySetInnerHTML={{ __html: (summaryStep.description || '').replace(/\n/g, '<br />') }}
          />
        </div>
      )}
      <div className="export-controls" style={{ marginBottom: 32, display: 'flex', gap: 12 }}>
        <button onClick={handleExportJSON} className="btn btn-accent">Export to JSON</button>
        <button onClick={handleExportMarkdown} className="btn btn-accent">Export to Markdown</button>
      </div>
      <div style={{ marginBottom: 32 }}>
        {steps.map((step) => {
          if (step.type === 'info' || step.type === 'summary') return null;
          const answer = answers[step.id];
          if (!answer) return null;
          // Multi-select (features) summary
          if (step.type === 'multi-select' && Array.isArray(answer)) {
            return (
              <div key={step.id} className="panel-neutral" style={{ marginBottom: 20, padding: '1rem 1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }} className="text-primary">{step.title}</div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {answer.map((val) => {
                    const opt = step.options.find((o: any) => o.value === val);
                    return (
                      <li key={val} className="text-primary" style={{ fontSize: '1rem', marginBottom: 2 }}>
                        {opt ? opt.label : val}
                        {opt && opt.description && (
                          <span className="text-muted" style={{ display: 'block', fontSize: 14, marginTop: 2 }}>{opt.description}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
          // Single-select and other types
          const opt = step.options.find((o: any) => o.value === answer);
          return (
            <div key={step.id} className="panel-neutral" style={{ marginBottom: 20, padding: '1rem 1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }} className="text-primary">{step.title}</div>
              <div className="text-primary" style={{ fontSize: '1rem' }}>
                {opt ? opt.label : answer}
                {opt && opt.description && (
                  <span className="text-muted" style={{ display: 'block', fontSize: 14, marginTop: 4 }}>{opt.description}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepSummary;
