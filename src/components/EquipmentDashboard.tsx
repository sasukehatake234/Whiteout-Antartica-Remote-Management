import React, { useState } from 'react';
import { 
  Cpu, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Radio, 
  Car, 
  Microscope, 
  ShieldCheck, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { EquipmentCategory, EquipmentItem, StationId } from '../types';

export const EquipmentDashboard: React.FC = () => {
  const { 
    equipment, 
    scheduleMaintenance, 
    selectedStationFilter, 
    setSelectedStationFilter 
  } = useStation();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredEquipment = equipment.filter(item => {
    if (selectedStationFilter !== 'all' && item.stationId !== selectedStationFilter) {
      return false;
    }
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const categories = [
    'all',
    'Generators',
    'Power Systems',
    'Heating & HVAC',
    'Communication',
    'Vehicles',
    'Scientific Equipment',
    'Safety Equipment',
  ];

  const maintenanceDueCount = filteredEquipment.filter(
    e => e.status === 'Maintenance Due' || e.status === 'Warning'
  ).length;

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                EQUIPMENT & PREDICTIVE MAINTENANCE
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mission-critical polar machinery, continuous vibration & thermal telemetry, and automated servicing rules.
            </p>
          </div>

          {/* Station Segmented Control */}
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

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-[11px] text-slate-500 mr-1">SUBSYSTEM:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}

          {maintenanceDueCount > 0 && (
            <span className="ml-auto px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              {maintenanceDueCount} ACTION RECOMMENDED
            </span>
          )}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEquipment.map(item => {
          const isWarning = item.status === 'Warning' || item.status === 'Maintenance Due';

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 bg-[#060a16] shadow-lg flex flex-col justify-between transition-all duration-200 ${
                isWarning ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-white uppercase">
                        🇮🇳 {item.stationId.toUpperCase()}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-cyan-400 uppercase text-[10px]">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm mt-1 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                    item.status === 'Operational'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : item.status === 'Maintenance Due'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}>
                    ● {item.status}
                  </span>
                </div>

                {/* Telemetry Metric Readouts */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">HEALTH</span>
                    <span className={`text-base font-bold font-mono-num ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.health}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">RUN HOURS</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {item.operatingHours}h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">SERVICE IN</span>
                    <span className={`text-base font-bold font-mono-num ${item.nextMaintenanceDueDays <= 5 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {item.nextMaintenanceDueDays}d
                    </span>
                  </div>
                </div>

                {/* Subsystem Live Telemetry Metrics */}
                {item.metrics && (
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2 rounded bg-[#030611] border border-slate-800/80">
                    {item.metrics.map((m, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-slate-500">{m.label}:</span>
                        <span className="text-slate-300 font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Predictive Maintenance "WHY?" Callout */}
                {item.predictiveWhy && (
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs font-mono">
                    <span className="text-amber-400 font-bold block mb-1 text-[10px] uppercase flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      PREDICTIVE RECOMMENDATION (WHY?):
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      {item.predictiveWhy.map((reason, idx) => (
                        <li key={idx} className="leading-snug">{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Maintenance Dispatch Action */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Last serviced: {item.lastMaintenanceDaysAgo}d ago
                </span>

                <button
                  onClick={() => scheduleMaintenance(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer shadow-sm"
                  title="Dispatch work order to on-station engineers"
                >
                  <Wrench className="w-3 h-3" />
                  <span>SCHEDULE SERVICE</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
