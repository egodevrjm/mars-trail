import React from 'react';
import { Package, Droplet, Battery, Wrench, Heart } from 'lucide-react';

const ResourceDisplay = ({ resources }) => {
  const resourceIcons = {
    food: Package,
    water: Droplet,
    energy: Battery,
    constructionMaterials: Wrench,
    medicalSupplies: Heart
  };

  return (
    <div className="border border-green-500 p-4 rounded-lg">
      <h3 className="text-lg mb-4">Supplies</h3>
      <div className="space-y-3">
        {Object.entries(resources).map(([resource, amount]) => {
          const Icon = resourceIcons[resource] || Package;
          return (
            <div key={resource} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="capitalize">{resource.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <span>{Math.round(amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceDisplay;