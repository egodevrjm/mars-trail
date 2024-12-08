import React, { useState } from 'react';
import { Store, Plus, Minus, Coins } from 'lucide-react';

const TradingPost = ({ location, resources, money, onTrade, onClose }) => {
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);

  const addToCart = (item, amount) => {
    const currentAmount = cart[item] || 0;
    const newAmount = Math.min(
      currentAmount + amount,
      location.trades[item].available
    );
    
    const newCart = { ...cart, [item]: newAmount };
    setCart(newCart);
    
    // Calculate total cost
    const newTotal = Object.entries(newCart).reduce((sum, [item, qty]) => {
      return sum + (qty * location.trades[item].price);
    }, 0);
    setTotal(newTotal);
  };

  const removeFromCart = (item, amount) => {
    const currentAmount = cart[item] || 0;
    const newAmount = Math.max(currentAmount - amount, 0);
    
    const newCart = { ...cart, [item]: newAmount };
    setCart(newCart);
    
    // Calculate total cost
    const newTotal = Object.entries(newCart).reduce((sum, [item, qty]) => {
      return sum + (qty * location.trades[item].price);
    }, 0);
    setTotal(newTotal);
  };

  const handleTrade = () => {
    if (total > money) return;
    onTrade(cart, total);
    setCart({});
    setTotal(0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="border-2 border-green-500 bg-black p-6 rounded-lg max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl flex items-center gap-2">
              <Store className="w-6 h-6" />
              {location.name}
            </h2>
            <p className="text-sm opacity-70">{location.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              <span>{money} credits</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {Object.entries(location.trades).map(([item, details]) => (
            <div key={item} className="border border-green-500 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="capitalize">{item.replace(/([A-Z])/g, ' $1')}</span>
                <span>{details.price} credits each</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Available: {details.available}
                  {resources[item] !== undefined && ` (You have: ${Math.floor(resources[item])})`}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item, 1)}
                    className="p-1 border border-green-500 rounded hover:bg-green-900/30"
                    disabled={!cart[item]}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-12 text-center">{cart[item] || 0}</span>
                  
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="p-1 border border-green-500 rounded hover:bg-green-900/30"
                    disabled={cart[item] >= details.available || total + details.price > money}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-green-500 pt-4">
          <div>
            <div className="text-lg">Total: {total} credits</div>
            {total > money && (
              <div className="text-red-500 text-sm">Not enough credits!</div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-green-500 rounded hover:bg-green-900/30"
            >
              Leave
            </button>
            
            <button
              onClick={handleTrade}
              disabled={total === 0 || total > money}
              className="px-4 py-2 border border-green-500 rounded hover:bg-green-900/30 disabled:opacity-50"
            >
              Complete Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPost;