import { useState, useEffect } from 'react';
import crewInteractions from '../data/crewInteractions.json';

export function useCrewSystem(initialCrew) {
  const [crew, setCrew] = useState(initialCrew || []);
  const [relationships, setRelationships] = useState({});
  const [activeEffects, setActiveEffects] = useState([]);
  const [crewHistory, setCrewHistory] = useState({});
  const [fatigue, setFatigue] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);

  // Initialize crew relationships and fatigue
  useEffect(() => {
    if (!crew.length) return;
    
    const newRelationships = {};
    const newFatigue = {};
    
    crew.forEach((member1) => {
      newFatigue[member1.id] = 0;
      crew.forEach((member2) => {
        if (member1.id !== member2.id) {
          const relationshipKey = `${member1.id}-${member2.id}`;
          if (!relationships[relationshipKey]) {
            newRelationships[relationshipKey] = {
              type: 'professional',
              strength: 1,
              history: []
            };
          }
        }
      });
    });

    setRelationships(prev => ({...prev, ...newRelationships}));
    setFatigue(prev => ({...prev, ...newFatigue}));
  }, [crew]);

  // Process active effects and fatigue
  useEffect(() => {
    const interval = setInterval(() => {
      // Process temporary effects
      setActiveEffects(prev => {
        const now = Date.now();
        return prev.filter(effect => {
          if (effect.endTime > now) {
            applyEffect(effect);
            return true;
          }
          return false;
        });
      });

      // Process fatigue
      if (selectedTask) {
        setFatigue(prev => {
          const newFatigue = {...prev};
          crew.forEach(member => {
            if (isWorkingOnTask(member.id, selectedTask)) {
              newFatigue[member.id] = Math.min(100, newFatigue[member.id] + 0.5);
            } else {
              newFatigue[member.id] = Math.max(0, newFatigue[member.id] - 0.2);
            }
          });
          return newFatigue;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEffects, selectedTask, crew]);

  function applyEffect(effect) {
    switch (effect.type) {
      case 'skillBoost':
        modifyCrewSkills(effect.targetId, effect.skill, effect.amount);
        break;
      case 'moraleEffect':
        modifyCrewMorale(effect.targetId, effect.amount);
        break;
      case 'relationshipEffect':
        modifyRelationship(effect.source, effect.target, effect.change);
        break;
    }
  }

  function getCrewEfficiency(task, assignedCrew) {
    let efficiency = 1;
    const skillRequirements = task.skillRequirements || {};

    // Base skill efficiency
    for (const [skill, required] of Object.entries(skillRequirements)) {
      const bestSkillLevel = Math.max(...assignedCrew.map(memberId => {
        const member = crew.find(m => m.id === memberId);
        return member?.skills[skill] || 0;
      }));

      efficiency *= (bestSkillLevel / required);
    }

    // Relationship bonuses/penalties
    if (assignedCrew.length > 1) {
      for (let i = 0; i < assignedCrew.length; i++) {
        for (let j = i + 1; j < assignedCrew.length; j++) {
          const relationshipKey = `${assignedCrew[i]}-${assignedCrew[j]}`;
          const relationship = relationships[relationshipKey];
          if (relationship) {
            switch (relationship.type) {
              case 'friendly':
                efficiency *= 1.1;
                break;
              case 'rivalry':
                efficiency *= 0.9;
                break;
              case 'conflict':
                efficiency *= 0.7;
                break;
              case 'mentor':
                efficiency *= 1.2;
                break;
            }
          }
        }
      }
    }

    // Fatigue penalty
    const averageFatigue = assignedCrew.reduce((sum, memberId) => 
      sum + (fatigue[memberId] || 0), 0) / assignedCrew.length;
    efficiency *= (1 - (averageFatigue / 200)); // Fatigue reduces efficiency up to 50%

    return efficiency;
  }

  function assignCrewToTask(task, crewIds) {
    if (selectedTask) {
      unassignTask();
    }

    setSelectedTask({
      ...task,
      assignedCrew: crewIds,
      startTime: Date.now()
    });

    // Record working relationships
    if (crewIds.length > 1) {
      for (let i = 0; i < crewIds.length; i++) {
        for (let j = i + 1; j < crewIds.length; j++) {
          modifyRelationship(crewIds[i], crewIds[j], 0.1);
        }
      }
    }
  }

  function unassignTask() {
    setSelectedTask(null);
  }

  function isWorkingOnTask(crewId, task) {
    return task?.assignedCrew?.includes(crewId);
  }

  function getCrewStatus(crewId) {
    const member = crew.find(m => m.id === crewId);
    if (!member) return null;

    return {
      ...member,
      fatigue: fatigue[crewId] || 0,
      currentTask: isWorkingOnTask(crewId, selectedTask) ? selectedTask : null,
      relationships: Object.entries(relationships)
        .filter(([key]) => key.includes(crewId))
        .map(([key, value]) => ({
          withCrewId: key.replace(crewId, '').replace('-', ''),
          ...value
        }))
    };
  }

  function getOptimalCrewForTask(task) {
    const skillRequirements = task.skillRequirements || {};
    const availableCrew = crew.filter(member => 
      !isWorkingOnTask(member.id, selectedTask) && fatigue[member.id] < 80
    );

    // Score each crew member based on relevant skills
    const crewScores = availableCrew.map(member => {
      let score = 0;
      for (const [skill, required] of Object.entries(skillRequirements)) {
        score += (member.skills[skill] || 0) / required;
      }
      return { member, score };
    });

    // Get top crew members
    return crewScores
      .sort((a, b) => b.score - a.score)
      .slice(0, task.optimalCrewSize || 1)
      .map(({ member }) => member.id);
  }

  function recordCrewActivity(activity) {
    setCrewHistory(prev => {
      const newHistory = {...prev};
      activity.involvedCrew.forEach(crewId => {
        if (!newHistory[crewId]) {
          newHistory[crewId] = [];
        }
        newHistory[crewId].push({
          ...activity,
          timestamp: Date.now()
        });
      });
      return newHistory;
    });
  }

  return {
    crew,
    relationships,
    activeEffects,
    fatigue,
    getCrewEfficiency,
    assignCrewToTask,
    unassignTask,
    getCrewStatus,
    getOptimalCrewForTask,
    recordCrewActivity,
    checkForCrewEvent
  };
}
