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
    <p style={{ color: '#555', marginBottom: 24 }}>{description}</p>
    <div>
      {options.map((opt) => (
        <label key={opt.value} style={{ display: 'block', marginBottom: 18, padding: 12, border: answer === opt.value ? '2px solid #eebbc3' : '1px solid #eebbc3', borderRadius: 8, background: answer === opt.value ? '#ffe5ec' : '#f3f3f3', cursor: 'pointer', transition: 'all 0.2s' }}>
          <input
            type="radio"
            name={stepId}
            value={opt.value}
            checked={answer === opt.value}
            onChange={() => handleSelect(stepId, opt.value)}
            style={{ marginRight: 12 }}
          />
          <strong>{opt.label}</strong>
          <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{opt.description}</div>
        </label>
      ))}
    </div>
  </>
);

export default StepSingleSelect;
