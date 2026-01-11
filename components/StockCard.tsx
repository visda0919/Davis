import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, Star, Bell } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onClick: (stock: Stock) => void;
  isSelected?: boolean;
  isFavorite?: boolean;
  hasAlert?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, stock: Stock) => void;
  onSetAlert?: (e: React.MouseEvent, stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, onClick, isSelected, isFavorite, hasAlert, onToggleFavorite, onSetAlert 
}) => {
  const isUp = stock.change >= 0;
  
  // Taiwan convention: Red is Up, Green is Down
  const colorClass = isUp ? 'text-red-500' : 'text-green-500';
  const bgClass = isUp ? 'bg-red-500/10' : 'bg-green-500/10';
  const borderClass = isSelected ? (isUp ? 'border-red-500' : 'border-green-500') : 'border-transparent';

  return (
    <div 
      onClick={() => onClick(stock)}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 group
        hover:bg-slate-800 ${isSelected ? 'bg-slate-800' : 'bg-slate-900'}
        ${borderClass}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-lg text-slate-100 flex items-center gap-2">
            {stock.symbol}
            {hasAlert && <Bell size={12} className="text-yellow-500 fill-yellow-500" />}
          </h4>
          <p className="text-xs text-slate-400 truncate max-w-[120px]">{stock.name}</p>
        </div>
        <div className="flex gap-2">
          {onToggleFavorite && (
            <button 
              onClick={(e) => onToggleFavorite(e, stock)}
              className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-200'}`}
            >
              <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
           {onSetAlert && (
            <button 
              onClick={(e) => onSetAlert(e, stock)}
              className={`p-1.5 rounded-full hover:bg-slate-700 transition-colors ${hasAlert ? 'text-blue-400' : 'text-slate-600 hover:text-blue-200'}`}
            >
              <Bell size={16} fill={hasAlert ? "currentColor" : "none"} />
            </button>
          )}
          <div className={`p-1.5 rounded-lg ${bgClass}`}>
            {isUp ? <TrendingUp size={16} className={colorClass} /> : <TrendingDown size={16} className={colorClass} />}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <span className="text-xl font-bold tracking-tight text-slate-200">
          {stock.price.toFixed(2)}
        </span>
        <div className={`text-right ${colorClass}`}>
          <div className="text-xs font-medium">{stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}</div>
          <div className="text-sm font-bold">{stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</div>
        </div>
      </div>
      
      {/* Mini info for screener view */}
      <div className="mt-2 flex gap-2 text-[10px] text-slate-500 border-t border-slate-800 pt-2">
        <span>P/E: {stock.pe}</span>
        <span>P/B: {stock.pb}</span>
        <span>Cap: {stock.marketCap}B</span>
      </div>
    </div>
  );
};

export default StockCard;
