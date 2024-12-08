import React, { useState } from 'react';
import { Terminal, AlertCircle, Users, Package, Activity, Shield, Clock } from 'lucide-react';
import ResourceDisplay from './ResourceDisplay';

const GameUI = ({ children, phase, crew, supplies, gameState }) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      {/* Header with game title and status */}
      <header className="border-b border-green-500 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-wider animate-pulse">MARS TRAIL</h1>
          <div className="flex items-center gap-4">
            <StatusIndicator icon={<Shield />} label="System Status" active={true} />
            <StatusIndicator icon={<Activity />} label="Comms" active={true} />
            {gameState.gameStarted && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{gameState.gameTime}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main game container */}
      <div className="flex gap-6">
        {/* Left sidebar with stats */}
        <aside className="w-64 border-r border-green-500 pr-4">
          <div className="space-y-4">
            <StatsPanel label="Mission Phase" icon={<Terminal />}>
              <span className="uppercase">{phase}</span>
            </StatsPanel>
            
            <StatsPanel label="Crew Status" icon={<Users />}>
              {crew?.length ? `${crew.length} Members` : 'Not Selected'}
            </StatsPanel>

            {gameState.gameStarted && (
              <ResourceDisplay resources={gameState.resources} />
            )}

            <button 
              onClick={() => setShowStats(!showStats)}
              className="w-full px-4 py-2 border border-green-500 hover:bg-green-900 transition-colors"
            >
              {showStats ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 border border-green-500 rounded-lg p-4 bg-black">
          <div className="relative">
            {/* Terminal-style header */}
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              <span className="text-sm opacity-70">MARS-OS v1.0.0</span>
            </div>

            {/* Content area with scan line effect */}
            <div className="relative min-h-[600px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/10 pointer-events-none" />
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar with alerts/notifications */}
        <aside className="w-72 border-l border-green-500 pl-4">
          <h2 className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" />
            Mission Alerts
          </h2>
          <div className="space-y-4">
            {gameState?.currentEvent && (
              <AlertBox 
                message={`Active Event: ${gameState.currentEvent.title}`} 
                type="warning" 
              />
            )}
            {gameState.resources?.food <= 20 && (
              <AlertBox message="Low Food Supply!" type="error" />
            )}
            {gameState.resources?.water <= 20 && (
              <AlertBox message="Low Water Supply!" type="error" />
            )}
            {gameState.resources?.energy <= 20 && (
              <AlertBox message="Low Energy!" type="error" />
            )}
          </div>
        </aside>
      </div>

      {/* Footer with additional stats or controls */}
      <footer className="border-t border-green-500 mt-6 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-70">Colony Mission Control • Est. 2024</span>
          <div className="flex items-center gap-4">
            <span className="text-sm">Sys.Status: NOMINAL</span>
            {gameState.gameStarted && (
              <span className="text-sm">Distance: {gameState.distanceTraveled}km</span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable components
const StatsPanel = ({ label, icon, children }) => (
  <div className="border border-green-500 p-3 rounded">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm opacity-70">{label}</span>
    </div>
    <div className="text-lg">{children}</div>
  </div>
);

const StatusIndicator = ({ icon, label, active }) => (
  <div className="flex items-center gap-2">
    <div className={`${active ? 'text-green-500' : 'text-red-500'}`}>
      {icon}
    </div>
    <span className="text-sm">{label}</span>
  </div>
);

const AlertBox = ({ message, type = 'info' }) => (
  <div className={`border ${type === 'error' ? 'border-red-500 text-red-500' : type === 'warning' ? 'border-yellow-500 text-yellow-500' : 'border-green-500'} p-3 rounded`}>
    <div className="flex items-center gap-2">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">{message}</span>
    </div>
  </div>
);

export default GameUI;