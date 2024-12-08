import { useState, useEffect } from 'react';
import initialResourcesData from '../data/initialResources.json';
import locations from '../data/locations.json';
import eventsData from '../data/events.json';

export function useGameLogic() {
  const [gameStarted, setGameStarted] = useState(false);
  const [resources, setResources] = useState(initialResourcesData);
  const [money, setMoney] = useState(0);
  const [crew, setCrew] = useState([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showTrading, setShowTrading] = useState(false);
  const [settlementReached, setSettlementReached] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [eventCooldown, setEventCooldown] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  function resetGame() {
    setGameStarted(false);
    setResources(initialResourcesData);
    setMoney(0);
    setCrew([]);
    setDistanceTraveled(0);
    setCurrentEvent(null);
    setCurrentLocation(null);
    setShowTrading(false);
    setSettlementReached(false);
    setGameTime(0);
    setLastUpdate(null);
    setNotifications([]);
    setEventCooldown(0);
    setGameOver(false);
    setGameOverReason(null);
    setIsPaused(false);
  }

  // Time and Travel Effect
  useEffect(() => {
    if (!gameStarted || settlementReached || gameOver || isPaused) return;

    const now = Date.now();
    if (lastUpdate) {
      const timeDiff = now - lastUpdate;
      consumeResources(timeDiff / 1000);
    }
    setLastUpdate(now);

    const timeInterval = setInterval(() => {
      setGameTime(prev => prev + 1);
      setEventCooldown(prev => Math.max(0, prev - 1));
    }, 1000);

    const travelInterval = setInterval(() => {
      setDistanceTraveled(prev => {
        const next = prev + 10; // Reduced from 50 to 10 for more granular movement
        // Check for location arrivals
        const nextLocation = locations.locations.find(loc => 
          prev < loc.distance && next >= loc.distance
        );
        
        if (nextLocation) {
          handleLocationArrival(nextLocation);
        }

        if (next >= locations.totalDistance) {
          setSettlementReached(true);
          addNotification({
            type: 'success',
            title: 'Settlement Reached!',
            message: 'Congratulations! You\'ve successfully reached the settlement.'
          });
          return locations.totalDistance;
        }

        return next;
      });
      
      if (eventCooldown === 0) {
        checkForEvent(distanceTraveled);
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(travelInterval);
    };
  }, [gameStarted, settlementReached, gameOver, lastUpdate, eventCooldown, isPaused]);

  function handleLocationArrival(location) {
    setCurrentLocation(location);
    setIsPaused(true);
    
    if (location.type === 'trading_post') {
      addNotification({
        type: 'info',
        title: 'Trading Post Reached',
        message: `You've arrived at ${location.name}. You can rest and trade here.`
      });
      setShowTrading(true);
    } else if (location.type === 'settlement') {
      setSettlementReached(true);
    }
  }

  function handleTrade(purchases, cost) {
    if (cost > money) return;

    setMoney(prev => prev - cost);
    setResources(prev => {
      const newResources = { ...prev };
      Object.entries(purchases).forEach(([item, amount]) => {
        newResources[item] = (newResources[item] || 0) + amount;
      });
      return newResources;
    });

    addNotification({
      type: 'success',
      title: 'Trade Complete',
      message: `Successfully purchased supplies for ${cost} credits.`
    });
  }

  function consumeResources(timeDelta) {
    // Consumption rates per minute - significantly reduced
    const rates = {
      food: 0.02 * crew.length, // 2% per minute per crew member
      water: 0.03 * crew.length, // 3% per minute per crew member
      energy: 0.05, // 5% per minute flat rate
      medicalSupplies: 0.01 // 1% per minute flat rate
    };

    setResources(prev => {
      const newResources = { ...prev };
      Object.entries(rates).forEach(([resource, rate]) => {
        if (newResources[resource] !== undefined) {
          newResources[resource] = Math.max(0, 
            newResources[resource] - (rate * timeDelta / 60)
          );
        }
      });
      return newResources;
    });

    // Check critical resources
    checkResourceLevels();
  }

  function checkResourceLevels() {
    const criticalResources = [];
    if (resources.food < 20) criticalResources.push('food');
    if (resources.water < 20) criticalResources.push('water');

    if (criticalResources.length > 0) {
      addNotification({
        type: 'warning',
        title: 'Low Resources',
        message: `Low on ${criticalResources.join(' and ')}! Find a trading post soon.`
      });
    }

    // Game over if resources are depleted
    if (resources.food <= 0 || resources.water <= 0) {
      const depletedResource = resources.food <= 0 ? 'food' : 'water';
      endGame(`Out of ${depletedResource} supplies`);
    }
  }

  function checkForEvent(dist) {
    // First check for any resource-critical events
    if (resources.food <= 10 || resources.water <= 10) {
      triggerResourceCrisisEvent();
      return;
    }

    // Then check distance-based events
    const distanceEvent = eventsData.find(ev => 
      ev.triggerDistance && 
      dist >= ev.triggerDistance && 
      dist < ev.triggerDistance + 50
    );

    if (distanceEvent) {
      setCurrentEvent(distanceEvent);
      setEventCooldown(180);
      return;
    }

    // Random events (reduced frequency)
    if (Math.random() < 0.2) { // 20% chance of checking for random event
      const randomEvent = eventsData.find(e => e.randomChance && Math.random() < e.randomChance);
      if (randomEvent) {
        setCurrentEvent(randomEvent);
        setEventCooldown(180);
      }
    }
  }

  function triggerResourceCrisisEvent() {
    const criticalResource = resources.food <= 10 ? 'food' : 'water';
    setCurrentEvent({
      id: 'resource_crisis',
      title: `Critical ${criticalResource} Shortage`,
      description: `Your ${criticalResource} supplies are dangerously low!`,
      severity: 'critical',
      choices: [
        {
          text: 'Emergency Rationing',
          description: 'Reduce consumption but impact crew health and morale',
          outcome: {
            healthChange: -10,
            moraleChange: -15,
            [`${criticalResource}Change`]: 20
          }
        },
        {
          text: 'Search for Resources',
          description: 'Stop to search for resources, but use energy and time',
          skillCheck: {
            terrainKnowledge: 2
          },
          outcome: {
            energyChange: -20,
            timeChange: 120,
            [`${criticalResource}Change`]: 40
          }
        }
      ]
    });
    setEventCooldown(180);
  }

  function addNotification(notification) {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }

  function endGame(reason) {
    setGameOver(true);
    setGameOverReason(reason);
    addNotification({
      type: 'error',
      title: 'Game Over',
      message: reason
    });
  }

  function startGame(initialCrew, initialSupplies, startingMoney) {
    resetGame();
    setCrew(initialCrew);
    setResources(initialSupplies);
    setMoney(startingMoney);
    setGameStarted(true);
    setLastUpdate(Date.now());
    setCurrentLocation(locations.locations[0]);
    addNotification({
      type: 'success',
      title: 'Mission Started',
      message: 'Your journey to Mars settlement has begun!'
    });
  }

  function resumeJourney() {
    setIsPaused(false);
    setShowTrading(false);
    setCurrentLocation(null);
    setLastUpdate(Date.now()); // Reset the last update time when resuming
  }

  return {
    resources,
    money,
    crew,
    distanceTraveled,
    currentLocation,
    showTrading,
    settlementReached,
    currentEvent,
    gameStarted,
    gameTime: formatGameTime(gameTime),
    notifications,
    gameOver,
    gameOverReason,
    handleTrade,
    resumeJourney,
    startGame,
    resetGame,
    isPaused
  };
}

function formatGameTime(minutes) {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;
  return `${days}d ${hours}h ${mins}m`;
}