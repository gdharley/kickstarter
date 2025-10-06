import React from 'react';

type Option = {
  value: string;
  label: string;
  description: string;
};

type StepSingleSelectProps = {
  stepId: string;
  description: string;
  options: Option[];
  answer: string | undefined;
  handleSelect: (stepId: string, value: string) => void;
};

const StepSingleSelect: React.FC<StepSingleSelectProps> = ({ stepId, description, options, answer, handleSelect }) => (
  <>
    <p className="text-muted" style={{ marginBottom: 24 }}>{description}</p>
    <div>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`wizard-step-option ${answer === opt.value ? 'selected' : ''}`}
          style={{ display: 'block', marginBottom: 18, padding: 12, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <input
            type="radio"
            name={stepId}
            value={opt.value}
            checked={answer === opt.value}
            onChange={() => handleSelect(stepId, opt.value)}
            style={{ marginRight: 12 }}
          />
          <strong>{opt.label}</strong>
          <div className="text-muted" style={{ fontSize: 14, marginTop: 4 }}>{opt.description}</div>
        </label>
      ))}
    </div>
  </>
);

export default StepSingleSelect;
