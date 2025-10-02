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
    <p style={{ color: '#555', marginBottom: 24 }}>{description}</p>
    <div style={{ marginBottom: 24, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <label htmlFor="customerName" style={{ fontWeight: 500, color: '#232946', marginBottom: 8 }}>Customer Name (optional):</label>
      <input
        id="customerName"
        type="text"
        value={customerName}
        onChange={e => setCustomerName(e.target.value)}
        placeholder="Enter customer name..."
        style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid #eebbc3', width: 280, fontSize: 16, marginBottom: 0 }}
      />
    </div>
    <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'center' }}>
      <label style={{ padding: '0.5rem 1rem', borderRadius: 6, border: 'none', background: '#eebbc3', color: '#232946', fontWeight: 500, cursor: 'pointer', marginBottom: 0 }}>
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
