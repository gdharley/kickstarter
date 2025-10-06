import React from 'react';

type Option = {
  value: string;
  label: string;
  description?: string;
};

type StepMultiSelectProps = {
  stepId: string;
  description: string;
  options: Option[];
  answer: string[];
  handleSelect: (stepId: string, value: string[]) => void;
};

const StepMultiSelect: React.FC<StepMultiSelectProps> = ({ stepId, description, options, answer, handleSelect }) => {
  const onChange = (value: string) => {
    let newAnswers = answer.includes(value)
      ? answer.filter((v) => v !== value)
      : [...answer, value];
    handleSelect(stepId, newAnswers);
  };

  return (
    <div style={{ width: '100%' }}>
      <p className="text-primary" style={{ marginBottom: 24, fontSize: '1.1rem' }}>{description}</p>
      <div>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`wizard-step-option ${answer.includes(opt.value) ? 'selected' : ''}`}
            style={{ display: 'block', marginBottom: 16, cursor: 'pointer', borderRadius: 10, padding: '14px 16px', transition: 'border 0.2s, background 0.2s' }}
          >
            <input
              type="checkbox"
              checked={answer.includes(opt.value)}
              onChange={() => onChange(opt.value)}
              style={{ marginRight: 12 }}
            />
            <span style={{ fontWeight: 600 }}>{opt.label}</span>
            {opt.description && <span style={{ display: 'block', marginTop: 4 }} className="text-muted">{opt.description}</span>}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepMultiSelect;
