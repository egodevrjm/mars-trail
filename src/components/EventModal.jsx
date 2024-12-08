import React from 'react';
import { AlertTriangle, Shield, Clock, Battery, Heart, Brain } from 'lucide-react';

const EventModal = ({ event, onChoice, crew, resources }) => {
  if (!event) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-500 border-red-500';
      case 'high': return 'text-yellow-500 border-yellow-500';
      case 'medium': return 'text-orange-500 border-orange-500';
      default: return 'text-green-500 border-green-500';
    }
  };

  const checkSkillRequirements = (choice) => {
    if (!choice.skillCheck || !crew) return true;
    
    // Find the crew member with the highest relevant skill
    return Object.entries(choice.skillCheck).every(([skill, level]) => {
      const bestCrewSkill = crew.reduce((max, member) => {
        return Math.max(max, member.skills[skill] || 0);
      }, 0);
      return bestCrewSkill >= level;
    });
  };

  const checkResourceRequirements = (choice) => {
    if (!choice.requiresResources || !resources) return true;

    return Object.entries(choice.requiresResources).every(([resource, amount]) => {
      return (resources[resource] || 0) >= amount;
    });
  };

  const handleChoice = (choice) => {
    // Add random chance of success based on crew skills
    const success = Math.random() < 0.7; // Base 70% success rate
    onChoice(choice, success);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className={`border-2 ${getSeverityColor(event.severity)} bg-black p-6 rounded-lg max-w-2xl w-full`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className={`w-6 h-6 ${getSeverityColor(event.severity)}`} />
          <h2 className="text-2xl">{event.title}</h2>
        </div>

        <p className="mb-6 text-lg">{event.description}</p>

        <div className="space-y-4">
          {event.choices.map((choice, index) => {
            const meetsSkillRequirements = checkSkillRequirements(choice);
            const meetsResourceRequirements = checkResourceRequirements(choice);
            const isDisabled = !meetsSkillRequirements || !meetsResourceRequirements;

            return (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                disabled={isDisabled}
                className={`w-full p-4 border ${isDisabled ? 'border-gray-700 text-gray-700' : 'border-green-500 hover:bg-green-900/30'} transition-colors text-left rounded-lg`}
              >
                <div className="font-bold mb-2">{choice.text}</div>
                <p className="text-sm opacity-70 mb-2">{choice.description}</p>

                {/* Requirements */}
                <div className="space-y-2 text-sm">
                  {choice.skillCheck && (
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <span>Required Skills: {Object.entries(choice.skillCheck)
                        .map(([skill, level]) => `${skill} (${level})`)
                        .join(', ')}
                      </span>
                    </div>
                  )}

                  {choice.requiresResources && (
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      <span>Required Resources: {Object.entries(choice.requiresResources)
                        .map(([resource, amount]) => `${resource} (${amount})`)
                        .join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Potential Outcomes */}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Potential Impact: {Object.entries(choice.outcome)
                      .filter(([key]) => !key.includes('Message'))
                      .map(([key, value]) => {
                        const label = key.replace('Change', '').replace(/([A-Z])/g, ' $1').toLowerCase();
                        return `${label} ${value > 0 ? '+' : ''}${value}`;
                      })
                      .join(', ')}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventModal;