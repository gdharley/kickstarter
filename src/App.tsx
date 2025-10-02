

import { useState, useRef } from 'react';


import StepIntro from './components/StepIntro';
import StepSingleSelect from './components/StepSingleSelect';
import StepSummary from './components/StepSummary';
import StepMultiSelect from './components/StepMultiSelect';
import { wizardConfig } from './wizardConfig';

type WizardStep = {
  id: string;
  title: string;
  description: string;
  type: string;
  options: Array<{ value: string; label: string; description: string }>;
};
type Answers = Record<string, string | string[]>;
function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [customerName, setCustomerName] = useState('');
  const step: WizardStep = wizardConfig[currentStep];
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  // Handle answer selection for single-select and multi-select steps
  const handleSelect = (stepId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  function isStepVisible(step: WizardStep, answers: Answers) {
    if (!('visibleIf' in step) || !step.visibleIf) return true;
    // Support both array and legacy object for backward compatibility
    const conditions = Array.isArray(step.visibleIf) ? step.visibleIf : [step.visibleIf];
    return conditions.every((cond: any) => {
      if (!cond) return true;
      const answer = answers[cond.stepId];
      if (cond.value !== undefined) {
        // Single value match (for single-select or string answer)
        return answer === cond.value;
      }
      if (cond.values !== undefined) {
        // Multi value match (for multi-select)
        if (Array.isArray(answer)) {
          // At least one value in answer matches one in cond.values
          return cond.values.some((v: string) => answer.includes(v));
        }
        return false;
      }
      return true;
    });
  }

  function answersToMarkdown(answers: Answers) {
  let md = `Results of kickstart questionnaire session${customerName ? ` with ${customerName}` : ''}`;
  md += '\n\n';
    for (const step of wizardConfig as WizardStep[]) {
      if (!isStepVisible(step, answers)) continue;
      const answer = answers[step.id];
      if (answer) {
        if (Array.isArray(answer)) {
          md += `## ${step.title}\n`;
          md += `**Answers:**\n`;
          for (const val of answer) {
            const opt = step.options.find((o: any) => o.value === val);
            md += `- ${opt ? opt.label : val}`;
            if (opt && opt.description) md += `: ${opt.description}`;
            md += '\n';
          }
          md += '\n';
        } else {
          const opt = step.options.find((o: any) => o.value === answer);
          md += `## ${step.title}\n`;
          md += `**Answer:** ${opt ? opt.label : answer}\n`;
          if (opt && opt.description) md += `\n${opt.description}`;
          md += '\n\n';
        }
      }
    }
    return md;
  }

  // Export answers as JSON
  const handleExportJSON = () => {
    const exportObj = { customerName, answers };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wizard-answers.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export answers as Markdown
  const handleExportMarkdown = () => {
    const md = answersToMarkdown(answers);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wizard-answers.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import answers from JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (typeof data === 'object' && data.answers) {
          setAnswers(data.answers);
          setCustomerName(data.customerName || '');
        } else {
          setAnswers(data);
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // TODO: Add conditional visibility and nested question logic here

  return (
    <div>
      {/* Left Navigation */}
  <nav className="wizard-nav" style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 260, zIndex: 10, color: '#232946', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 12px #0001', borderRight: '2px solid #eebbc3', padding: '0 1rem 2rem 1rem' }}>
        <div className="wizard-nav-logo">
          <img src="data:image/png;base64,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" alt="Wizard Logo" />
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2rem 0', letterSpacing: '0.01em' }}>Wizard Steps</h2>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, overflowY: 'auto' }}>
          {wizardConfig.map((s: WizardStep, idx: number) => {
            // Hide Infrastructure step unless deployment type is on-premise
            if (s.id === 'infrastructure') {
              if (answers['deployment-type'] !== 'on-premise') {
                return null;
              }
            }
            const isCompleted =
              s.type === 'info' ||
              s.type === 'summary' ||
              (s.type === 'single-select' && answers[s.id]) ||
              (s.type === 'multi-select' && Array.isArray(answers[s.id]) && answers[s.id].length > 0);
            const isCurrent = idx === currentStep;
            return (
              <li key={s.id} style={{ marginBottom: 16 }}>
                <button
                  style={{
                    width: '100%',
                    background: isCurrent ? '#eebbc3' : isCompleted ? '#fbeaec' : '#f6f8fa',
                    color: isCurrent ? '#232946' : '#232946',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    cursor: isCurrent || isCompleted ? 'pointer' : 'not-allowed',
                    fontWeight: isCurrent ? 700 : 400,
                    fontSize: 16,
                    opacity: isCurrent || isCompleted ? 1 : 0.6,
                    transition: 'background 0.2s',
                  }}
                  onClick={() => (isCurrent || isCompleted) && setCurrentStep(idx)}
                  disabled={!(isCurrent || isCompleted)}
                >
                  {s.title}
                  {isCompleted && s.type !== 'info' && s.type !== 'summary' && (
                    <span style={{ float: 'right', fontSize: 13, color: '#eebbc3', fontWeight: 500 }}>
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
  {/* Main Content */}
  <main style={{ marginLeft: 260, width: 'calc(100vw - 260px)', minWidth: 320, maxWidth: '100vw', padding: '3rem 2rem', background: '#f6f8fa', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
  <div style={{ maxWidth: 900, minWidth: 400, width: '70%', margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px #0002', padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '0.01em', color: '#232946' }}>{step.title}</h1>
          {step.type === 'info' && (
            <StepIntro
              description={step.description}
              fileInputRef={fileInputRef}
              handleImportJSON={handleImportJSON}
              customerName={customerName}
              setCustomerName={setCustomerName}
            />
          )}
          {/* Hide Infrastructure step panel unless deployment type is on-premise */}
          {step.type === 'single-select' && (step.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') && (
            <>
              <div className="wizard-description-panel" style={{ width: '100%', marginBottom: 16, padding: '16px', background: '#f4f8fd', borderRadius: 8, border: '1px solid #e3eefe' }}>
                <div
                  style={{ color: '#232946', fontSize: '1.1rem' }}
                  dangerouslySetInnerHTML={{ __html: (step.description || '').replace(/\n/g, '<br />') }}
                />
              </div>
              <StepSingleSelect
                stepId={step.id}
                description={''}
                options={step.options}
                answer={typeof answers[step.id] === 'string' ? (answers[step.id] as string) : ''}
                handleSelect={handleSelect}
              />
              <div className="wizard-resources-panel" style={{ width: '100%', margin: '24px 0 0 0', padding: '16px', background: '#f4f8fd', borderRadius: 8, border: '1px solid #e3eefe' }}>
                <strong>Resources:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  <li><a href="https://documentation.flowable.com/latest/" target="_blank" rel="noopener noreferrer">Flowable Documentation</a></li>
                </ul>
              </div>
            </>
          )}
          {step.type === 'multi-select' && (
            <>
              <div className="wizard-description-panel" style={{ width: '100%', marginBottom: 16, padding: '16px', background: '#f4f8fd', borderRadius: 8, border: '1px solid #e3eefe' }}>
                <div
                  style={{ color: '#232946', fontSize: '1.1rem' }}
                  dangerouslySetInnerHTML={{ __html: (step.description || '').replace(/\n/g, '<br />') }}
                />
              </div>
              <StepMultiSelect
                stepId={step.id}
                description={''}
                options={step.options}
                answer={Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : []}
                handleSelect={handleSelect}
              />
              <div className="wizard-resources-panel" style={{ width: '100%', margin: '24px 0 0 0', padding: '16px', background: '#f4f8fd', borderRadius: 8, border: '1px solid #e3eefe' }}>
                <strong>Resources:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  <li><a href="https://documentation.flowable.com/latest/" target="_blank" rel="noopener noreferrer">Flowable Documentation</a></li>
                </ul>
              </div>
            </>
          )}
          {step.type === 'summary' && (
            <StepSummary
              steps={wizardConfig.filter((s) => isStepVisible(s, answers)) as WizardStep[]}
              answers={Object.fromEntries(Object.entries(answers).filter(([k]) => {
                const step = (wizardConfig as WizardStep[]).find((s) => s.id === k);
                return step && isStepVisible(step, answers);
              }).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v]))}
              handleExportJSON={handleExportJSON}
              handleExportMarkdown={handleExportMarkdown}
            />
          )}
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 32 }}>
            <button
              onClick={() => {
                let prev = currentStep - 1;
                while (prev >= 0) {
                  const prevStep = wizardConfig[prev];
                  if (prevStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') break;
                  prev--;
                }
                setCurrentStep(Math.max(0, prev));
              }}
              disabled={currentStep === 0 || (currentStep > 0 && (() => {
                let prev = currentStep - 1;
                while (prev >= 0) {
                  const prevStep = wizardConfig[prev];
                  if (prevStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') return false;
                  prev--;
                }
                return true;
              })())}
              style={{ padding: '0.5rem 1.5rem', borderRadius: 6, border: 'none', background: '#eebbc3', color: '#232946', fontWeight: 600, cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button
              onClick={() => {
                let next = currentStep + 1;
                while (next < wizardConfig.length) {
                  const nextStep = wizardConfig[next];
                  if (nextStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') break;
                  next++;
                }
                setCurrentStep(Math.min(wizardConfig.length - 1, next));
              }}
              disabled={
                currentStep === (wizardConfig as WizardStep[]).length - 1 ||
                (currentStep < wizardConfig.length - 1 && (() => {
                  let next = currentStep + 1;
                  while (next < wizardConfig.length) {
                    const nextStep = wizardConfig[next];
                    if (nextStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') return false;
                    next++;
                  }
                  return true;
                })()) ||
                (step.type === 'single-select' && !answers[step.id]) ||
                (step.type === 'multi-select' && (!Array.isArray(answers[step.id]) || (answers[step.id] as string[]).length === 0))
              }
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: 6,
                border: 'none',
                background: (currentStep === (wizardConfig as WizardStep[]).length - 1 ||
                  (step.type === 'single-select' && !answers[step.id]) ||
                  (currentStep < wizardConfig.length - 1 && (() => {
                    let next = currentStep + 1;
                    while (next < wizardConfig.length) {
                      const nextStep = wizardConfig[next];
                      if (nextStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') return false;
                      next++;
                    }
                    return true;
                  })())
                ) ? '#f6f8fa' : '#eebbc3',
                color: '#232946',
                fontWeight: 600,
                cursor: (currentStep === (wizardConfig as WizardStep[]).length - 1 ||
                  (step.type === 'single-select' && !answers[step.id]) ||
                  (currentStep < wizardConfig.length - 1 && (() => {
                    let next = currentStep + 1;
                    while (next < wizardConfig.length) {
                      const nextStep = wizardConfig[next];
                      if (nextStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') return false;
                      next++;
                    }
                    return true;
                  })())
                ) ? 'not-allowed' : 'pointer',
                opacity: (currentStep === (wizardConfig as WizardStep[]).length - 1 ||
                  (step.type === 'single-select' && !answers[step.id]) ||
                  (currentStep < wizardConfig.length - 1 && (() => {
                    let next = currentStep + 1;
                    while (next < wizardConfig.length) {
                      const nextStep = wizardConfig[next];
                      if (nextStep.id !== 'infrastructure' || answers['deployment-type'] === 'on-premise') return false;
                      next++;
                    }
                    return true;
                  })())
                ) ? 0.4 : 1
              }}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
