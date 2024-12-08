import React from 'react';

function StatusBar({ gameState }) {
  const { settlers, resources } = gameState;

  const avgMorale = Math.round(settlers.reduce((sum, s) => sum + s.morale, 0) / settlers.length);
  const avgHealth = Math.round(settlers.reduce((sum, s) => sum + s.health, 0) / settlers.length);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: '#333',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    }}>
      <div>
        <p>Morale</p>
        <div style={{
          width: '100px',
          height: '10px',
          background: '#555',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${avgMorale}%`,
            height: '100%',
            background: avgMorale > 50 ? '#4caf50' : '#f44336',
          }}></div>
        </div>
      </div>

      <div>
        <p>Health</p>
        <div style={{
          width: '100px',
          height: '10px',
          background: '#555',
          borderRadius: '5px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${avgHealth}%`,
            height: '100%',
            background: avgHealth > 50 ? '#4caf50' : '#f44336',
          }}></div>
        </div>
      </div>

      <div>
        <p>Resources</p>
        <p>🍎 {resources.food} | 💧 {resources.water} | ⚡ {resources.energy}</p>
      </div>
    </div>
  );
}

export default StatusBar;
