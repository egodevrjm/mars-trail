import React, { useState } from 'react';
import { AlertCircle, Heart, Brain } from 'lucide-react';
import initialSettlers from '../data/initialSettlers.json';

const INITIAL_BUDGET = 500;

const CrewSelection = ({ onNext }) => {
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [error, setError] = useState('');
  const [budget, setBudget] = useState(INITIAL_BUDGET);

  const remainingSettlers = initialSettlers.filter(
    settler => !selectedCrew.find(crew => crew.id === settler.id)
  );

  const handleSelectCrew = (settler) => {
    if (selectedCrew.length >= 4) {
      setError('Maximum crew size is 4 members');
      return;
    }

    if (budget - settler.cost < 0) {
      setError('Not enough budget to hire this crew member');
      return;
    }

    setSelectedCrew([...selectedCrew, settler]);
    setBudget(budget - settler.cost);
    setError('');
  };

  const handleRemoveMember = (settler) => {
    setSelectedCrew(crew => crew.filter(member => member.id !== settler.id));
    setBudget(budget + settler.cost);
    setError('');
  };

  const handleSubmit = () => {
    if (selectedCrew.length < 2) {
      setError('You need at least 2 crew members');
      return;
    }
    onNext(selectedCrew);
  };

  const getSkillBars = (skills) => {
    return Object.entries(skills).map(([skill, level]) => (
      <div key={skill} className="flex items-center gap-2 text-sm">
        <span className="w-32 capitalize">{skill.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
        <div className="flex-1 h-1 bg-black border border-green-500 rounded-full">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${(level / 5) * 100}%` }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-xl mb-4 flex justify-between items-center">
        <span>Select Your Crew</span>
        <span className="text-lg">Budget: {budget} credits</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Available Settlers */}
        <div className="border border-green-500 p-4 rounded-lg">
          <h3 className="text-lg mb-4">Available Settlers</h3>
          <div className="space-y-4">
            {remainingSettlers.map(settler => (
              <div key={settler.id} className="border border-green-500 p-3 rounded hover:bg-green-900/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{settler.name}</div>
                    <div className="text-sm opacity-70">{settler.role}</div>
                  </div>
                  <div className="text-sm">{settler.cost} credits</div>
                </div>

                <div className="space-y-1 mb-3">
                  {getSkillBars(settler.skills)}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{settler.health}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span className="text-sm">{settler.morale}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectCrew(settler)}
                    className="px-3 py-1 border border-green-500 rounded hover:bg-green-900 transition-colors"
                    disabled={budget < settler.cost}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Crew */}
        <div className="border border-green-500 p-4 rounded-lg">
          <h3 className="text-lg mb-4">Selected Crew ({selectedCrew.length}/4)</h3>
          <div className="space-y-4">
            {selectedCrew.map(member => (
              <div key={member.id} className="border border-green-500 p-3 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{member.name}</div>
                    <div className="text-sm opacity-70">{member.role}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-1">
                  {getSkillBars(member.skills)}
                </div>
              </div>
            ))}

            {selectedCrew.length === 0 && (
              <div className="text-center opacity-50 py-8">
                No crew members selected
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedCrew.length < 2}
        className="w-full p-3 border border-green-500 rounded hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedCrew.length < 2 
          ? 'Select at least 2 crew members to continue'
          : `Launch Mission with ${selectedCrew.length} Crew Members`}
      </button>
    </div>
  );
};

export default CrewSelection;