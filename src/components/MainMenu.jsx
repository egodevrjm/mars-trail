import React from 'react';

function MainMenu({ onStart }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Mars Trail</h1>
      <p>Lead your group to a new settlement near the water source.</p>
      <button onClick={onStart} style={{
        padding: '1rem 2rem',
        fontSize: '1.2rem',
        cursor: 'pointer'
      }}>
        Start Expedition
      </button>
    </div>
  );
}

export default MainMenu;
