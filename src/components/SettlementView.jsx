import React from 'react';
import placeholderSettlement from '../assets/images/placeholder_settlement.png';

function SettlementView() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>New Settlement</h2>
      <img src={placeholderSettlement} alt="Settlement placeholder" style={{ maxWidth: '300px' }} />
      <p>You have arrived! Establish your colony infrastructure here.</p>
    </div>
  );
}

export default SettlementView;
