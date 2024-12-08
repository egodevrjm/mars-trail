import React, { useState } from 'react';
import { AlertCircle, Package } from 'lucide-react';

const AVAILABLE_ITEMS = [
  { id: 'food', name: 'Food Supplies', price: 10, description: 'Dehydrated meals and protein packs' },
  { id: 'water', name: 'Water', price: 15, description: 'Purified water containers' },
  { id: 'energy', name: 'Energy Cells', price: 20, description: 'Portable power units' },
  { id: 'constructionMaterials', name: 'Construction Materials', price: 25, description: 'Basic building and repair supplies' },
  { id: 'medicalSupplies', name: 'Medical Supplies', price: 30, description: 'First aid and emergency medical equipment' },
];

const INITIAL_MONEY = 1000; // Starting money

const Store = ({ crew, onNext }) => {
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [inventory, setInventory] = useState({
    food: 0,
    water: 0,
    energy: 0,
    constructionMaterials: 0,
    medicalSupplies: 0
  });
  const [error, setError] = useState('');

  const buyItem = (itemId) => {
    const item = AVAILABLE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (money < item.price) {
      setError('Not enough money!');
      return;
    }

    setMoney(prev => prev - item.price);
    setInventory(prev => ({
      ...prev,
      [itemId]: prev[itemId] + 1
    }));
    setError('');
  };

  const sellItem = (itemId) => {
    const item = AVAILABLE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (inventory[itemId] <= 0) {
      setError(`No ${item.name} to sell!`);
      return;
    }

    setMoney(prev => prev + Math.floor(item.price * 0.75)); // 75% of original price
    setInventory(prev => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }));
    setError('');
  };

  const handleContinue = () => {
    // Basic validation
    if (inventory.food === 0 || inventory.water === 0) {
      setError('You need at least some food and water!');
      return;
    }

    onNext({ inventory, remainingMoney: money });
  };

  return (
    <div className="space-y-6">
      <div className="border border-green-500 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">Supply Store</h2>
          <div className="text-lg">Credits: {money}</div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {AVAILABLE_ITEMS.map(item => (
            <div key={item.id} className="border border-green-500 p-3 rounded flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="font-bold">{item.name}</span>
                </div>
                <p className="text-sm text-green-700">{item.description}</p>
                <div className="text-sm">Price: {item.price} credits</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center min-w-[3rem]">
                  {inventory[item.id]}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sellItem(item.id)}
                    className="px-3 py-1 border border-red-500 rounded hover:bg-red-900/30 transition-colors"
                    disabled={inventory[item.id] <= 0}
                  >
                    Sell
                  </button>
                  <button
                    onClick={() => buyItem(item.id)}
                    className="px-3 py-1 border border-green-500 rounded hover:bg-green-900/30 transition-colors"
                    disabled={money < item.price}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full p-3 border border-green-500 rounded hover:bg-green-900 transition-colors"
      >
        Begin Journey
      </button>
    </div>
  );
};

export default Store;