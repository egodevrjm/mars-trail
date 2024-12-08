import React from 'react';
import { Map, MapPin, Navigation } from 'lucide-react';
import locations from '../data/locations.json';

const GameMap = ({ gameState, onLocationInteract }) => {
  const { distanceTraveled } = gameState;
  const progress = (distanceTraveled / locations.totalDistance) * 100;
  
  // Find current and next location
  const currentLocation = locations.locations.reduce((prev, curr) => {
    if (distanceTraveled >= curr.distance) return curr;
    return prev;
  }, locations.locations[0]);

  const nextLocation = locations.locations.find(loc => 
    loc.distance > distanceTraveled
  );

  const distanceToNext = nextLocation ? nextLocation.distance - distanceTraveled : 0;

  const renderLocationMarker = (location) => {
    const markerProgress = (location.distance / locations.totalDistance) * 100;
    const isPassed = distanceTraveled >= location.distance;
    const isCurrent = currentLocation.id === location.id;
    const isNext = nextLocation?.id === location.id;

    return (
      <div
        key={location.id}
        className={`absolute -translate-y-1/2 ${isPassed ? 'text-green-700' : 'text-green-500'}`}
        style={{ left: `${markerProgress}%` }}
      >
        <div className="relative">
          <MapPin 
            className={`w-6 h-6 cursor-pointer transition-all
              ${isCurrent ? 'text-yellow-500 w-8 h-8' : ''}
              ${isNext ? 'animate-pulse' : ''}
              ${location.type === 'trading_post' ? 'text-blue-500' : ''}
              ${location.type === 'settlement' ? 'text-green-500' : ''}
            `}
            onClick={() => onLocationInteract(location)}
          />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <div className="text-xs font-bold">{location.name}</div>
            <div className="text-xs opacity-70">{location.distance}km</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-green-500 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5" />
        <h2 className="text-xl">Journey Progress</h2>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-green-500 p-2 rounded">
          <div className="text-sm opacity-70">Current Location</div>
          <div className="text-lg">{currentLocation.name}</div>
        </div>
        <div className="border border-green-500 p-2 rounded">
          <div className="text-sm opacity-70">Distance to Next Stop</div>
          <div className="text-lg">{distanceToNext}km</div>
        </div>
      </div>

      {/* Progress bar and location markers */}
      <div className="relative mb-16">
        {/* Progress bar */}
        <div className="h-2 bg-black border border-green-500 rounded-full mb-4">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current position marker */}
        <div 
          className="absolute top-0 -translate-y-1/2 transition-all duration-500"
          style={{ left: `${progress}%` }}
        >
          <Navigation className="w-4 h-4 text-yellow-500 animate-pulse" />
        </div>

        {/* Location markers */}
        {locations.locations.map(renderLocationMarker)}
      </div>

      {/* Location info */}
      <div className="border border-green-500 p-3 rounded">
        <div className="text-sm opacity-70">Current Status</div>
        <div className="text-lg">{currentLocation.description}</div>
        {nextLocation && (
          <div className="text-sm mt-2">
            Next Stop: {nextLocation.name} - {distanceToNext}km ahead
          </div>
        )}
      </div>
    </div>
  );
};

export default GameMap;