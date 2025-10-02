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
      <p style={{ marginBottom: 24, color: '#232946', fontSize: '1.1rem' }}>{description}</p>
      <div>
        {options.map((opt) => (
          <label key={opt.value} style={{ display: 'block', marginBottom: 16, cursor: 'pointer', background: answer.includes(opt.value) ? '#ffe5ec' : '#f3f3f3', border: answer.includes(opt.value) ? '2px solid #eebbc3' : '1.5px solid #eebbc3', borderRadius: 10, padding: '14px 16px', transition: 'border 0.2s, background 0.2s' }}>
            <input
              type="checkbox"
              checked={answer.includes(opt.value)}
              onChange={() => onChange(opt.value)}
              style={{ marginRight: 12 }}
            />
            <span style={{ fontWeight: 600 }}>{opt.label}</span>
            {opt.description && <span style={{ display: 'block', color: '#555', fontSize: 14, marginTop: 4 }}>{opt.description}</span>}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepMultiSelect;
