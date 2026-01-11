import React from 'react';
import {
  ComposedChart,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { CandleData } from '../types';

interface TechnicalChartProps {
  data: CandleData[];
  symbol: string;
}

const TechnicalChart: React.FC<TechnicalChartProps> = ({ data, symbol }) => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-xl shadow-lg border border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
        <h3 className="text-xl font-bold text-slate-100">{symbol} Analysis</h3>
        <div className="flex flex-wrap gap-3 text-[10px] md:text-xs text-slate-400">
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div>MA5</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full"></div>MA10</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-400 rounded-full"></div>MA20</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full"></div>MA60</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full"></div>MA120</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col p-2 space-y-1 overflow-hidden">
        {/* Main Price Chart */}
        <div className="flex-[3] min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              syncId="technicalId"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" hide />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={['auto', 'auto']} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={{ stroke: '#475569' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                itemStyle={{ padding: 0 }}
                formatter={(value: number) => value.toLocaleString()}
              />
              
              {/* Candles handled as Line for simplicity in this mixed view, or bars if complex. 
                  Using Line for Close and ReferenceAreas is hard in Recharts without custom shapes.
                  We stick to Line + Bar volume + MAs.
              */}
              <Line yAxisId="right" type="monotone" dataKey="close" stroke="#f8fafc" strokeWidth={2} dot={false} name="Price" />
              <Line yAxisId="right" type="monotone" dataKey="ma5" stroke="#facc15" strokeWidth={1} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ma10" stroke="#fb923c" strokeWidth={1} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ma20" stroke="#c084fc" strokeWidth={1} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ma60" stroke="#60a5fa" strokeWidth={1} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ma120" stroke="#94a3b8" strokeWidth={1} dot={false} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              syncId="technicalId"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
               <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" hide />
              <YAxis 
                orientation="right" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val/1000).toFixed(0) + 'k'}
              />
              <Tooltip cursor={{fill: 'transparent'}} content={<></>} />
              <Bar dataKey="volume" barSize={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.close >= entry.open ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RSI Chart */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute top-1 left-2 text-[10px] text-slate-500 font-bold z-10">RSI (14)</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              syncId="technicalId"
              margin={{ top: 5, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" hide />
              <YAxis 
                orientation="right" 
                domain={[0, 100]} 
                ticks={[30, 70]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" opacity={0.5} />
              <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" opacity={0.5} />
              <Tooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1}} contentStyle={{ backgroundColor: '#0f172a', fontSize: '10px' }} />
              <Line type="monotone" dataKey="rsi" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MACD Chart */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute top-1 left-2 text-[10px] text-slate-500 font-bold z-10">MACD (12, 26, 9)</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              syncId="technicalId"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#94a3b8', fontSize: 10 }} 
                tickLine={false}
                axisLine={{ stroke: '#475569' }}
                minTickGap={50}
              />
              <YAxis 
                orientation="right" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
              />
              <Tooltip cursor={{stroke: '#cbd5e1', strokeWidth: 1}} contentStyle={{ backgroundColor: '#0f172a', fontSize: '10px' }} />
              <Bar dataKey="macdHist" barSize={3}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={(entry.macdHist || 0) > 0 ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="macd" stroke="#fbbf24" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="macdSignal" stroke="#38bdf8" strokeWidth={1} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TechnicalChart;
