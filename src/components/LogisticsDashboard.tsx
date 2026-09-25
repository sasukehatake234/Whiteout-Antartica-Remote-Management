import React, { useState } from 'react';
import { 
  Boxes, 
  Fuel, 
  HeartPulse, 
  Utensils, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Calendar, 
  TrendingDown, 
  History 
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId, SupplyItem } from '../types';

export const LogisticsDashboard: React.FC = () => {
  const { supplies, orderSupplyRequisition, selectedStationFilter, setSelectedStationFilter } = useStation();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'fuel' | 'food' | 'medical' | 'spares' | 'emergency'>('all');
  const [selectedSupplyHistory, setSelectedSupplyHistory] = useState<SupplyItem | null>(null);

  const getFilteredItems = (): (SupplyItem & { stationId: StationId })[] => {
    const list: (SupplyItem & { stationId: StationId })[] = [];
    if (selectedStationFilter === 'all' || selectedStationFilter === 'maitri') {
      supplies.maitri.forEach(s => list.push({ ...s, stationId: 'maitri' }));
    }
    if (selectedStationFilter === 'all' || selectedStationFilter === 'bharati') {
      supplies.bharati.forEach(s => list.push({ ...s, stationId: 'bharati' }));
    }
    if (categoryFilter === 'all') return list;
    return list.filter(item => item.category === categoryFilter);
  };

  const items = getFilteredItems();
  const actionRequiredCount = items.filter(i => i.status === 'ACTION_REQUIRED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header & Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Boxes className="w-4 h-4" />
              </div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                LOGISTICS & “DAYS REMAINING” INTELLIGENCE
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Antarctic winter replenishment forecasting: calculates daily burn rates against mandatory minimum reserve thresholds.
            </p>
          </div>

          {/* Quick Filter: Station */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedStationFilter('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL STATIONS
            </button>
            <button
              onClick={() => setSelectedStationFilter('maitri')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'maitri' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              MAITRI
            </button>
            <button
              onClick={() => setSelectedStationFilter('bharati')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'bharati' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              BHARATI
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-[11px] text-slate-500 mr-1">CATEGORY:</span>
          {(['all', 'fuel', 'medical', 'food', 'spares', 'emergency'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase ${
                categoryFilter === cat
                  ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}

          {actionRequiredCount > 0 && (
            <span className="ml-auto px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              {actionRequiredCount} BELOW MIN RESERVE
            </span>
          )}
        </div>
      </div>

      {/* Supplies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(supply => {
          const isActionReq = supply.status === 'ACTION_REQUIRED';
          const isLow = supply.estimatedRemainingDays <= supply.minimumReserveDays;

          return (
            <div
              key={`${supply.stationId}-${supply.id}`}
              className={`rounded-xl border p-5 bg-[#060a16] shadow-lg flex flex-col justify-between transition-all duration-200 ${
                isActionReq
                  ? 'border-red-500/60 bg-red-950/10'
                  : isLow
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-white uppercase">
                        🇮🇳 {supply.stationId.toUpperCase()}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-cyan-400 uppercase text-[10px]">
                        {supply.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mt-1 leading-snug">
                      {supply.name}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                    isActionReq
                      ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                      : isLow
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    ● {supply.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Key Numbers Grid: Percentage, Days Remaining, Min Reserve */}
                <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-400 uppercase text-[10px]">CURRENT QUANTITY:</span>
                    <span className={`text-xl font-bold font-mono-num ${isActionReq ? 'text-red-400' : 'text-white'}`}>
                      {supply.currentPercentage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar with Minimum Reserve Marker */}
                  <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        isActionReq ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${supply.currentPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">EST. REMAINING</span>
                      <span className={`font-bold text-sm ${isActionReq ? 'text-red-400' : 'text-emerald-400'}`}>
                        {supply.estimatedRemainingDays} DAYS
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px] uppercase">MIN RESERVE</span>
                      <span className="font-bold text-sm text-slate-300">
                        {supply.minimumReserveDays} DAYS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics Metadata */}
                <div className="text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="text-slate-300">{supply.totalCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consumption:</span>
                    <span className="text-slate-300">{supply.dailyConsumption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Cargo Vessel:</span>
                    <span className="text-slate-300">{supply.lastDelivered}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSupplyHistory(supply)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>VIEW HISTORY</span>
                </button>

                <button
                  onClick={() => orderSupplyRequisition(supply.stationId, supply.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer shadow-sm"
                  title="Simulate dispatching a replenishment requisition"
                >
                  <Send className="w-3 h-3" />
                  <span>REORDER</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* History Modal */}
      {selectedSupplyHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-slate-800 bg-[#070b18] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">CONSUMPTION HISTORY</span>
                <h3 className="font-semibold text-white text-base">{selectedSupplyHistory.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedSupplyHistory(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              30-day recorded stockpile progression for {selectedSupplyHistory.stationId ? selectedSupplyHistory.stationId.toUpperCase() : 'ANTARCTIC'} station.
            </p>

            {/* Sparkline / Bar Chart Visualization */}
            <div className="space-y-2 font-mono text-xs">
              {selectedSupplyHistory.history.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-16 text-slate-400 text-[11px]">{h.day}</span>
                  <div className="flex-1 h-3 rounded bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded" 
                      style={{ width: `${h.level}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-200 font-bold">{h.level}%</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSupplyHistory(null)}
                className="px-4 py-1.5 rounded text-xs font-mono bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
