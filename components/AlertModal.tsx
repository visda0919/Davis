import React, { useState } from 'react';
import { Stock, StockAlert } from '../types';
import { Bell, X, Check } from 'lucide-react';

interface AlertModalProps {
  stock: Stock;
  onClose: () => void;
  onSave: (alert: StockAlert) => void;
  existingAlert?: StockAlert;
}

const AlertModal: React.FC<AlertModalProps> = ({ stock, onClose, onSave, existingAlert }) => {
  const [highPrice, setHighPrice] = useState<string>(existingAlert?.targetPriceHigh?.toString() || '');
  const [lowPrice, setLowPrice] = useState<string>(existingAlert?.targetPriceLow?.toString() || '');
  const [pctUp, setPctUp] = useState<string>(existingAlert?.targetPercentUp?.toString() || '');
  const [pctDown, setPctDown] = useState<string>(existingAlert?.targetPercentDown?.toString() || '');

  const handleSave = () => {
    const alert: StockAlert = {
      symbol: stock.symbol,
      targetPriceHigh: highPrice ? parseFloat(highPrice) : undefined,
      targetPriceLow: lowPrice ? parseFloat(lowPrice) : undefined,
      targetPercentUp: pctUp ? parseFloat(pctUp) : undefined,
      targetPercentDown: pctDown ? parseFloat(pctDown) : undefined,
      isActive: true,
    };
    onSave(alert);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bell size={20} className="text-blue-400" />
            Set Alert for {stock.symbol}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 hover:bg-slate-700 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-400 text-sm">Current Price</span>
            <span className="text-xl font-bold text-slate-100">{stock.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-red-400 uppercase tracking-wider">Target Price High</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={highPrice}
                  onChange={(e) => setHighPrice(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-green-400 uppercase tracking-wider">Target Price Low</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={lowPrice}
                  onChange={(e) => setLowPrice(e.target.value)}
                  placeholder="e.g. 90"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-red-400 uppercase tracking-wider">Up %</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={pctUp}
                  onChange={(e) => setPctUp(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-red-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-slate-500">%</span>
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-green-400 uppercase tracking-wider">Down %</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={pctDown}
                  onChange={(e) => setPctDown(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-green-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 font-medium transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-colors">
            <Check size={18} /> Save Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
