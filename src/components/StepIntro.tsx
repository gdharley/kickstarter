import React from 'react';

type StepIntroProps = {
  description: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
};

const StepIntro: React.FC<StepIntroProps> = ({ description, fileInputRef, handleImportJSON, customerName, setCustomerName }) => (
  <>
    <p className="text-muted" style={{ marginBottom: 24 }}>{description}</p>
    <div style={{ marginBottom: 24, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label htmlFor="customerName" className="text-primary" style={{ fontWeight: 500, marginBottom: 8 }}>Customer Name (optional):</label>
      <input
        id="customerName"
        type="text"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
        placeholder="Enter customer name..."
        className="input"
      />
    </div>
    <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'center' }}>
      <label className="btn btn-accent" style={{ fontWeight: 500, marginBottom: 0 }}>
        Import JSON
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={handleImportJSON}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  </>
);

export default StepIntro;
