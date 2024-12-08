import React, { useState } from 'react';
import CrewSelection from './components/CrewSelection';
import Store from './components/Store';
import GameMap from './components/GameMap';
import CharacterList from './components/CharacterList';
import EventModal from './components/EventModal';
import NotificationSystem from './components/NotificationSystem';
import TradingPost from './components/TradingPost';
import { useGameLogic } from './hooks/useGameLogic';
import GameUI from './components/GameUI';

function App() {
  const [phase, setPhase] = useState('setup');
  const [crew, setCrew] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const gameState = useGameLogic();

  const handleNext = (data) => {
    if (phase === 'setup') {
      setCrew(data);
      setPhase('store');
    } else if (phase === 'store') {
      setSupplies(data.inventory);
      gameState.startGame(crew, data.inventory, data.remainingMoney);
      setPhase('journey');
    }
  };

  const handleRestartGame = () => {
    gameState.resetGame();
    setPhase('setup');
    setCrew([]);
    setSupplies([]);
  };

  const handleLocationInteract = (location) => {
    if (location.type === 'trading_post' && gameState.isPaused && gameState.currentLocation?.id === location.id) {
      setShowTrading(true);
    }
  };

  const handleTrade = (purchases, cost) => {
    gameState.handleTrade(purchases, cost);
  };

  const handleResumeJourney = () => {
    gameState.resumeJourney();
  };

  return (
    <>
      <GameUI phase={phase} crew={crew} supplies={supplies} gameState={gameState}>
        {gameState.gameOver ? (
          <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-3xl mb-4">Game Over</h2>
            <p className="text-xl mb-8">{gameState.gameOverReason}</p>
            <button
              onClick={handleRestartGame}
              className="px-6 py-3 border border-green-500 rounded hover:bg-green-900 transition-colors"
            >
              Start New Game
            </button>
          </div>
        ) : (
          <>
            {phase === 'setup' && <CrewSelection onNext={(data) => handleNext(data)} />}
            {phase === 'store' && <Store crew={crew} onNext={(data) => handleNext(data)} />}
            {phase === 'journey' && (
              <div className="space-y-6">
                <CharacterList crew={crew} />
                <GameMap 
                  gameState={gameState}
                  onLocationInteract={handleLocationInteract}
                />
                {gameState.isPaused && (
                  <div className="border border-green-500 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl mb-2">{gameState.currentLocation?.name}</h3>
                        <p className="opacity-70">{gameState.currentLocation?.description}</p>
                      </div>
                      <button
                        onClick={handleResumeJourney}
                        className="px-4 py-2 border border-green-500 rounded hover:bg-green-900 transition-colors"
                      >
                        Continue Journey
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </GameUI>

      {/* Event Modal */}
      <EventModal 
        event={gameState.currentEvent} 
        onChoice={gameState.chooseEventOption}
        crew={crew}
        resources={gameState.resources}
      />

      {/* Trading Post */}
      {gameState.showTrading && gameState.currentLocation && (
        <TradingPost
          location={gameState.currentLocation}
          resources={gameState.resources}
          money={gameState.money}
          onTrade={handleTrade}
          onClose={handleResumeJourney}
        />
      )}

      {/* Notifications */}
      <NotificationSystem 
        notifications={gameState.notifications}
        onDismiss={() => {}}
      />
    </>
  );
}

export default App;