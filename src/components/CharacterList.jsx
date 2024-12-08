import React from 'react';
import { Users, Heart, Smile } from 'lucide-react';

const CharacterList = ({ crew }) => {
  return (
    <div className="border border-green-500 p-4 rounded-lg mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h2 className="text-xl">Crew Status</h2>
      </div>

      <div className="space-y-4">
        {crew.map((member, index) => (
          <div key={index} className="border border-green-500 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{member.name}</span>
              <span className="text-sm opacity-70">{member.role}</span>
            </div>

            {/* Status bars */}
            <div className="space-y-2">
              {/* Health bar */}
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <div className="flex-1 h-2 bg-black border border-green-500 rounded-full">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${member.health}%` }}
                  />
                </div>
                <span className="text-sm w-8">{member.health}%</span>
              </div>

              {/* Morale bar */}
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-yellow-500" />
                <div className="flex-1 h-2 bg-black border border-green-500 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${member.morale}%` }}
                  />
                </div>
                <span className="text-sm w-8">{member.morale}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;