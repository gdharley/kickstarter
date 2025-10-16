

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
  <nav className="wizard-nav nav-fixed nav-width">
        <div className="wizard-nav-logo">
          <img src="/flowable.jpg" alt="Wizard Logo" />
        </div>
  <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 2rem 0', letterSpacing: '0.01em' }}>Kickstart Steps</h2>
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
                  className={`btn ${isCurrent ? 'btn-primary' : isCompleted ? 'btn-accent' : 'btn-muted'}`}
                  style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', fontSize: 16, fontWeight: isCurrent ? 700 : 400, opacity: isCurrent || isCompleted ? 1 : 0.6, cursor: isCurrent || isCompleted ? 'pointer' : 'not-allowed' }}
                  onClick={() => (isCurrent || isCompleted) && setCurrentStep(idx)}
                  disabled={!(isCurrent || isCompleted)}
                >
                  {s.title}
                  {isCompleted && s.type !== 'info' && s.type !== 'summary' && (
                    <span style={{ float: 'right', fontSize: 20, fontWeight: 500 }} className="text-primary">
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
  <main className="main-container">
  <div className="wizard-step-panel container-wide">
    <h1 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '0.01em' }}>{step.title}</h1>
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
              <div className="wizard-description-panel" style={{ width: '100%', marginBottom: 16 }}>
                <div className="text-primary" style={{ fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: (step.description || '').replace(/\n/g, '<br />') }} />
              </div>
              <StepSingleSelect
                stepId={step.id}
                description={''}
                options={step.options}
                answer={typeof answers[step.id] === 'string' ? (answers[step.id] as string) : ''}
                handleSelect={handleSelect}
              />
              <div className="wizard-resources-panel" style={{ width: '100%', margin: '24px 0 0 0' }}>
                <strong>Resources:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  <li><a href="https://documentation.flowable.com/latest/" target="_blank" rel="noopener noreferrer">Flowable Documentation</a></li>
                </ul>
              </div>
            </>
          )}
          {step.type === 'multi-select' && (
            <>
              <div className="wizard-description-panel" style={{ width: '100%', marginBottom: 16 }}>
                <div
                  className="text-primary"
                  style={{ fontSize: '1.1rem' }}
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
              <div className="wizard-resources-panel" style={{ width: '100%', margin: '24px 0 0 0' }}>
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
              className="btn btn-accent"
              style={{ cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.5 : 1 }}
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
              className={`btn ${
                (currentStep === (wizardConfig as WizardStep[]).length - 1 ||
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
                ) ? 'btn-muted' : 'btn-accent'
              }`}
              style={{ opacity: (
                currentStep === (wizardConfig as WizardStep[]).length - 1 ||
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
              ) ? 0.4 : 1 }}
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
