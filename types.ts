export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: 'TW' | 'US';
  sector: string;
  pe: number;        // P/E Ratio
  pb: number;        // P/B Ratio
  marketCap: number; // In Billions
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma60?: number;
  ma120?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export interface AnalysisResult {
  text: string;
  relatedSymbols?: string[];
}

export interface StockAlert {
  symbol: string;
  targetPriceHigh?: number;
  targetPriceLow?: number;
  targetPercentUp?: number;
  targetPercentDown?: number;
  isActive: boolean;
}
