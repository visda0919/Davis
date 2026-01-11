import React, { useState, useEffect } from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';

export interface FilterCriteria {
  minPE: number;
  maxPE: number;
  minPB: number;
  maxPB: number;
  sector: string;
}

interface ScreenerPanelProps {
  onFilterChange: (criteria: FilterCriteria) => void;
  availableSectors: string[];
}

const ScreenerPanel: React.FC<ScreenerPanelProps> = ({ onFilterChange, availableSectors }) => {
  const [minPE, setMinPE] = useState(0);
  const [maxPE, setMaxPE] = useState(100);
  const [minPB, setMinPB] = useState(0);
  const [maxPB, setMaxPB] = useState(20);
  const [sector, setSector] = useState('All');

  useEffect(() => {
    onFilterChange({ minPE, maxPE, minPB, maxPB, sector });
  }, [minPE, maxPE, minPB, maxPB, sector]);

  const resetFilters = () => {
    setMinPE(0);
    setMaxPE(100);
    setMinPB(0);
    setMaxPB(20);
    setSector('All');
  };

  return (
    <div className="p-4 bg-slate-800 rounded-xl space-y-4 border border-slate-700 mb-4 animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center text-slate-200 mb-2">
        <h4 className="font-bold flex items-center gap-2"><Filter size={16} /> Screener</h4>
        <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 flex justify-between">
          <span>P/E Ratio</span>
          <span className="text-slate-200">{minPE} - {maxPE}</span>
        </label>
        <div className="flex gap-2 items-center">
          <input 
            type="range" min="0" max="100" value={minPE} 
            onChange={(e) => setMinPE(Number(e.target.value))}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <input 
            type="range" min="0" max="150" value={maxPE} 
            onChange={(e) => setMaxPE(Number(e.target.value))}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 flex justify-between">
          <span>P/B Ratio</span>
          <span className="text-slate-200">{minPB} - {maxPB}</span>
        </label>
        <div className="flex gap-2 items-center">
          <input 
            type="range" min="0" max="20" value={minPB} 
            onChange={(e) => setMinPB(Number(e.target.value))}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
          <input 
            type="range" min="0" max="50" value={maxPB} 
            onChange={(e) => setMaxPB(Number(e.target.value))}
            className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Sector</label>
        <select 
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Sectors</option>
          {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
};

export default ScreenerPanel;
