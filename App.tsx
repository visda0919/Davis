import React, { useState, useEffect, useMemo } from 'react';
import { Stock, CandleData, StockAlert } from './types';
import { getMarketOverview, generateCandleData, getAllStocks } from './services/stockService';
import StockCard from './components/StockCard';
import TechnicalChart from './components/TechnicalChart';
import ChatBot from './components/ChatBot';
import ImageAnalyzer from './components/ImageAnalyzer';
import ScreenerPanel, { FilterCriteria } from './components/ScreenerPanel';
import AlertModal from './components/AlertModal';
import { LayoutDashboard, LineChart, MessageSquare, Image as ImageIcon, Search, Star, Filter, Bell } from 'lucide-react';

enum Tab {
  MARKET = 'MARKET',
  CHAT = 'CHAT',
  VISION = 'VISION'
}

enum SidebarMode {
  MARKET = 'MARKET',
  WATCHLIST = 'WATCHLIST',
  SCREENER = 'SCREENER'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MARKET);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(SidebarMode.MARKET);
  const [marketType, setMarketType] = useState<'TW' | 'US'>('TW');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [allStocks, setAllStocks] = useState<Stock[]>([]); // For watchlist/screener across markets
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New State Features
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<Map<string, StockAlert>>(new Map());
  const [showScreener, setShowScreener] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria | null>(null);
  const [alertStock, setAlertStock] = useState<Stock | null>(null); // Stock being configured for alert
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Load
  useEffect(() => {
    loadMarket(marketType);
    loadAllStocks();
  }, [marketType]);

  const loadMarket = async (type: 'TW' | 'US') => {
    setLoading(true);
    const data = await getMarketOverview(type);
    setStocks(data);
    
    // Select first stock if none selected or invalid
    if (!selectedStock || (sidebarMode === SidebarMode.MARKET && selectedStock.market !== type)) {
      handleStockSelect(data[0]);
    }
    setLoading(false);
  };

  const loadAllStocks = async () => {
    const all = await getAllStocks();
    setAllStocks(all);
  };

  const handleStockSelect = (stock: Stock) => {
    if (!stock) return;
    setSelectedStock(stock);
    const candleData = generateCandleData(stock.symbol);
    setChartData(candleData);
  };

  // Watchlist Logic
  const toggleFavorite = (e: React.MouseEvent, stock: Stock) => {
    e.stopPropagation();
    setWatchlist(prev => {
      const next = new Set(prev);
      if (next.has(stock.symbol)) {
        next.delete(stock.symbol);
      } else {
        next.add(stock.symbol);
      }
      return next;
    });
  };

  // Alert Logic
  const openAlertModal = (e: React.MouseEvent, stock: Stock) => {
    e.stopPropagation();
    setAlertStock(stock);
  };

  const saveAlert = (alert: StockAlert) => {
    setAlerts(prev => {
      const next = new Map(prev);
      next.set(alert.symbol, alert);
      return next;
    });
    setAlertStock(null);
  };

  // Filtering Logic
  const displayedStocks = useMemo(() => {
    let source = sidebarMode === SidebarMode.MARKET ? stocks : allStocks;

    // 1. Filter by Search
    if (searchQuery) {
      source = source.filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter by Mode
    if (sidebarMode === SidebarMode.WATCHLIST) {
      source = source.filter(s => watchlist.has(s.symbol));
    } else if (sidebarMode === SidebarMode.SCREENER && filterCriteria) {
      source = source.filter(s => 
        s.pe >= filterCriteria.minPE && s.pe <= filterCriteria.maxPE &&
        s.pb >= filterCriteria.minPB && s.pb <= filterCriteria.maxPB &&
        (filterCriteria.sector === 'All' || s.sector === filterCriteria.sector)
      );
    }

    return source;
  }, [stocks, allStocks, sidebarMode, watchlist, filterCriteria, searchQuery]);

  const availableSectors = useMemo(() => {
    const sectors = new Set(allStocks.map(s => s.sector));
    return Array.from(sectors);
  }, [allStocks]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-6 justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LineChart className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden md:block">
            GlobalStock AI
          </h1>
        </div>

        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
          <button 
            onClick={() => setActiveTab(Tab.MARKET)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.MARKET ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LayoutDashboard size={16} /> Market
          </button>
          <button 
            onClick={() => setActiveTab(Tab.CHAT)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.CHAT ? 'bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare size={16} /> AI Chat
          </button>
          <button 
            onClick={() => setActiveTab(Tab.VISION)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Tab.VISION ? 'bg-purple-600/20 text-purple-400 shadow-sm border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ImageIcon size={16} /> Vision
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        
        {/* Left Sidebar */}
        <div className={`
          w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-900/30 flex flex-col
          ${activeTab !== Tab.MARKET ? 'hidden md:flex' : 'flex'}
        `}>
          {/* List Controls */}
          <div className="p-4 border-b border-slate-800 space-y-4">
            {/* View Modes */}
            <div className="flex bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => setSidebarMode(SidebarMode.MARKET)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md flex justify-center items-center gap-1 ${sidebarMode === SidebarMode.MARKET ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
              >
                Market
              </button>
              <button 
                onClick={() => setSidebarMode(SidebarMode.WATCHLIST)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md flex justify-center items-center gap-1 ${sidebarMode === SidebarMode.WATCHLIST ? 'bg-slate-700 text-yellow-400 shadow' : 'text-slate-400'}`}
              >
                <Star size={12} /> Watch
              </button>
              <button 
                onClick={() => setSidebarMode(SidebarMode.SCREENER)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md flex justify-center items-center gap-1 ${sidebarMode === SidebarMode.SCREENER ? 'bg-slate-700 text-blue-400 shadow' : 'text-slate-400'}`}
              >
                <Filter size={12} /> Filter
              </button>
            </div>

            {/* Sub-controls based on Mode */}
            {sidebarMode === SidebarMode.MARKET && (
              <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setMarketType('TW')}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${marketType === 'TW' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  TW Stock
                </button>
                <button
                  onClick={() => setMarketType('US')}
                  className={`py-2 rounded-lg text-sm font-bold transition-all ${marketType === 'US' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  US Stock
                </button>
              </div>
            )}

            {/* Screener Panel */}
            {sidebarMode === SidebarMode.SCREENER && (
              <ScreenerPanel 
                onFilterChange={setFilterCriteria} 
                availableSectors={availableSectors} 
              />
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search symbol or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Stock List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center p-8 text-slate-500">Loading market data...</div>
            ) : displayedStocks.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-sm">No stocks found matching your criteria.</div>
            ) : (
              displayedStocks.map(stock => (
                <StockCard 
                  key={stock.symbol} 
                  stock={stock} 
                  isSelected={selectedStock?.symbol === stock.symbol}
                  isFavorite={watchlist.has(stock.symbol)}
                  hasAlert={alerts.has(stock.symbol)}
                  onClick={handleStockSelect} 
                  onToggleFavorite={toggleFavorite}
                  onSetAlert={openAlertModal}
                />
              ))
            )}
          </div>
        </div>

        {/* Center/Right Content */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-slate-950 p-4 md:p-6 gap-6
          ${activeTab === Tab.MARKET ? 'hidden md:flex' : 'flex'}
        `}>
          {activeTab === Tab.MARKET && selectedStock && (
            <div className="h-full flex flex-col gap-6 animate-fade-in">
              <div className="flex-1 min-h-0">
                <TechnicalChart data={chartData} symbol={selectedStock.symbol} />
              </div>
              <div className="h-1/3 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[300px]">
                <ChatBot />
                <div className="hidden lg:block">
                  <ImageAnalyzer />
                </div>
              </div>
            </div>
          )}

          {activeTab === Tab.CHAT && (
             <div className="h-full max-w-4xl mx-auto w-full pt-4">
                <ChatBot />
             </div>
          )}

          {activeTab === Tab.VISION && (
            <div className="h-full max-w-4xl mx-auto w-full pt-4">
              <ImageAnalyzer />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {alertStock && (
        <AlertModal 
          stock={alertStock} 
          onClose={() => setAlertStock(null)} 
          onSave={saveAlert}
          existingAlert={alerts.get(alertStock.symbol)}
        />
      )}
    </div>
  );
};

export default App;
