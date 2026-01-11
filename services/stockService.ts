import { Stock, CandleData } from '../types';

const TW_STOCKS: Stock[] = [
  { symbol: '2330', name: '台積電', price: 980.00, change: 12.00, changePercent: 1.24, market: 'TW', sector: 'Semiconductor', pe: 28.5, pb: 5.4, marketCap: 25000 },
  { symbol: '2454', name: '聯發科', price: 1150.00, change: -15.00, changePercent: -1.29, market: 'TW', sector: 'Semiconductor', pe: 22.1, pb: 4.1, marketCap: 1800 },
  { symbol: '2317', name: '鴻海', price: 175.50, change: 2.50, changePercent: 1.45, market: 'TW', sector: 'Electronics', pe: 14.2, pb: 1.8, marketCap: 2400 },
  { symbol: '2603', name: '長榮', price: 188.00, change: 4.50, changePercent: 2.45, market: 'TW', sector: 'Shipping', pe: 4.5, pb: 0.9, marketCap: 380 },
  { symbol: '2881', name: '富邦金', price: 72.40, change: 0.80, changePercent: 1.12, market: 'TW', sector: 'Finance', pe: 11.2, pb: 1.1, marketCap: 850 },
  { symbol: '3008', name: '大立光', price: 2450.00, change: -40.00, changePercent: -1.61, market: 'TW', sector: 'Optoelectronics', pe: 18.5, pb: 3.2, marketCap: 320 },
  { symbol: '3231', name: '緯創', price: 118.00, change: 1.50, changePercent: 1.29, market: 'TW', sector: 'Computer', pe: 16.8, pb: 2.1, marketCap: 340 },
];

const US_STOCKS: Stock[] = [
  { symbol: 'NVDA', name: 'NVIDIA', price: 145.20, change: 3.45, changePercent: 2.43, market: 'US', sector: 'Technology', pe: 64.2, pb: 35.5, marketCap: 3100 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 224.50, change: -1.20, changePercent: -0.53, market: 'US', sector: 'Technology', pe: 32.1, pb: 14.2, marketCap: 3400 },
  { symbol: 'TSLA', name: 'Tesla', price: 240.30, change: 12.50, changePercent: 5.49, market: 'US', sector: 'Automotive', pe: 58.4, pb: 9.8, marketCap: 780 },
  { symbol: 'AMD', name: 'AMD', price: 160.40, change: 2.10, changePercent: 1.33, market: 'US', sector: 'Technology', pe: 38.5, pb: 4.5, marketCap: 260 },
  { symbol: 'MSFT', name: 'Microsoft', price: 420.80, change: 1.50, changePercent: 0.36, market: 'US', sector: 'Technology', pe: 35.8, pb: 12.1, marketCap: 3150 },
  { symbol: 'AMZN', name: 'Amazon', price: 185.60, change: -0.90, changePercent: -0.48, market: 'US', sector: 'Consumer Cyclical', pe: 42.1, pb: 8.2, marketCap: 1950 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 175.20, change: 0.50, changePercent: 0.29, market: 'US', sector: 'Communication', pe: 24.5, pb: 6.8, marketCap: 2100 },
];

export const getMarketOverview = (market: 'TW' | 'US'): Promise<Stock[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(market === 'TW' ? TW_STOCKS : US_STOCKS);
    }, 300);
  });
};

export const getAllStocks = async (): Promise<Stock[]> => {
  return [...TW_STOCKS, ...US_STOCKS];
};

// Helper to calculate EMA
const calculateEMA = (data: number[], days: number, prevEMA?: number): number => {
  const k = 2 / (days + 1);
  if (prevEMA === undefined) return data[0]; // Simple logic for start
  return data[data.length - 1] * k + prevEMA * (1 - k);
};

export const generateCandleData = (symbol: string, days: number = 180): CandleData[] => {
  const data: CandleData[] = [];
  let basePrice = symbol === '2330' ? 900 : symbol === 'NVDA' ? 130 : 100;
  
  // Random walk for price generation
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    const volatility = basePrice * 0.025;
    const change = (Math.random() - 0.48) * volatility; 
    const open = basePrice + (Math.random() - 0.5) * (volatility * 0.5);
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
    const volume = Math.floor(Math.random() * 50000) + 10000;

    basePrice = close;

    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
  }

  // Post-processing to add Indicators
  const closePrices = data.map(d => d.close);
  let ema12 = closePrices[0];
  let ema26 = closePrices[0];
  let macdSignal = 0;
  
  // RSI Helpers
  let gain = 0;
  let loss = 0;

  return data.map((item, index, array) => {
    // MAs
    const getMA = (n: number) => {
      if (index < n - 1) return undefined;
      const slice = array.slice(index - n + 1, index + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
      return parseFloat((sum / n).toFixed(2));
    };

    // MACD Calculation (Simplified EMA loop)
    if (index > 0) {
        ema12 = item.close * (2/13) + ema12 * (1 - 2/13);
        ema26 = item.close * (2/27) + ema26 * (1 - 2/27);
    }
    const macdLine = ema12 - ema26;
    if (index > 0) {
        macdSignal = macdLine * (2/10) + macdSignal * (1 - 2/10);
    }
    const macdHist = macdLine - macdSignal;

    // RSI Calculation (14 days)
    let rsi = 50;
    if (index > 0) {
        const change = item.close - array[index - 1].close;
        const currentGain = change > 0 ? change : 0;
        const currentLoss = change < 0 ? -change : 0;

        if (index < 14) {
            gain += currentGain;
            loss += currentLoss;
        } else {
            if (index === 14) {
                gain /= 14;
                loss /= 14;
            } else {
                gain = (gain * 13 + currentGain) / 14;
                loss = (loss * 13 + currentLoss) / 14;
            }
            const rs = loss === 0 ? 100 : gain / loss;
            rsi = 100 - (100 / (1 + rs));
        }
    }

    return {
      ...item,
      ma5: getMA(5),
      ma10: getMA(10),
      ma20: getMA(20),
      ma60: getMA(60),
      ma120: getMA(120),
      macd: parseFloat(macdLine.toFixed(2)),
      macdSignal: parseFloat(macdSignal.toFixed(2)),
      macdHist: parseFloat(macdHist.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(2)),
    };
  });
};