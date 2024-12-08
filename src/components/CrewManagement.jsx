import React, { useState } from 'react';
import { Users, Heart, Brain, Battery, Activity, AlertCircle } from 'lucide-react';

const CrewManagement = ({ crewSystem }) => {
  const [selectedCrew, setSelectedCrew] = useState(null);

  const renderRelationshipIndicator = (relationship) => {
    const colors = {
      friendly: 'text-green-500',
      rivalry: 'text-yellow-500',
      conflict: 'text-red-500',
      mentor: 'text-blue-500',
      professional: 'text-gray-500'
    };

    return (
      <div className={`flex items-center gap-2 ${colors[relationship.type]}`}>
        <div className="w-2 h-2 rounded-full bg-current" />
        <span className="capitalize">{relationship.type}</span>
      </div>
    );
  };

  const renderCrewCard = (crewMember) => {
    const status = crewSystem.getCrewStatus(crewMember.id);
    
    return (
      <div 
        key={crewMember.id}
        className={`border ${selectedCrew?.id === crewMember.id ? 'border-green-500' : 'border-green-900'} 
                   rounded-lg p-4 cursor-pointer hover:bg-green-900/20 transition-colors`}
        onClick={() => setSelectedCrew(status)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg">{crewMember.name}</h3>
            <p className="text-sm opacity-70">{crewMember.role}</p>
          </div>
          {status.currentTask && (
            <span className="text-xs px-2 py-1 bg-green-900/50 rounded-full">
              Working
            </span>
          )}
        </div>

        {/* Status Bars */}
        <div className="space-y-2">
          <StatusBar 
            icon={<Heart className="w-4 h-4" />}
            label="Health"
            value={crewMember.health}
            color="red"
          />
          <StatusBar 
            icon={<Brain className="w-4 h-4" />}
            label="Morale"
            value={crewMember.morale}
            color="yellow"
          />
          <StatusBar 
            icon={<Battery className="w-4 h-4" />}
            label="Fatigue"
            value={status.fatigue}
            color="blue"
            reversed
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Crew List */}
      <div className="col-span-2 space-y-4">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Crew Status
        </h2>
        {crewSystem.crew.map(renderCrewCard)}
      </div>

      {/* Crew Details */}
      {selectedCrew && (
        <div className="border border-green-500 rounded-lg p-4">
          <h3 className="text-xl mb-4">{selectedCrew.name} - Details</h3>

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-sm opacity-70 mb-2">Skills</h4>
            <div className="space-y-2">
              {Object.entries(selectedCrew.skills).map(([skill, level]) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-sm capitalize w-24">
                    {skill.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <div className="flex-1 h-1 bg-black border border-green-500 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(level / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm w-8">{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relationships */}
          <div className="mb-4">
            <h4 className="text-sm opacity-70 mb-2">Relationships</h4>
            <div className="space-y-2">
              {selectedCrew.relationships.map((rel, index) => {
                const withCrew = crewSystem.crew.find(m => m.id === rel.withCrewId);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{withCrew?.name}</span>
                    {renderRelationshipIndicator(rel)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Activity */}
          {selectedCrew.currentTask && (
            <div className="mt-4 border border-green-500 rounded p-3">
              <h4 className="text-sm opacity-70 mb-2">Current Activity</h4>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>{selectedCrew.currentTask.name}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatusBar = ({ icon, label, value, color, reversed = false }) => {
  const getColor = () => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  const displayValue = reversed ? 100 - value : value;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span>{label}</span>
          <span>{Math.round(displayValue)}%</span>
        </div>
        <div className="h-1 bg-black border border-green-500 rounded-full">
          <div
            className={`h-full ${getColor()} rounded-full transition-all duration-300`}
            style={{ width: `${displayValue}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CrewManagement;