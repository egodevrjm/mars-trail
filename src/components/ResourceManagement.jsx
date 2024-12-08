import React from 'react';

function ResourceManagement({ gameState }) {
  const { resources } = gameState;

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h3>Resources</h3>
      <p>Food: {resources.food}</p>
      <p>Water: {resources.water}</p>
      <p>Energy: {resources.energy}</p>
      <p>Construction Materials: {resources.constructionMaterials}</p>
    </div>
  );
}

export default ResourceManagement;
