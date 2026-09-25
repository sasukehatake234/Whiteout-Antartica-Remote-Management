import React, { useState } from 'react';
import { 
  Zap, 
  Fuel, 
  Boxes, 
  Users, 
  Thermometer, 
  AlertTriangle, 
  ArrowRight, 
  Scale, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface StationCommandCardsProps {
  onViewStation: (id: StationId) => void;
  onOpenCompare: () => void;
}

export const StationCommandCards: React.FC<StationCommandCardsProps> = ({ 
  onViewStation, 
  onOpenCompare 
}) => {
  const { stations } = useStation();
  const [activeScoreBreakdown, setActiveScoreBreakdown] = useState<StationId | null>(null);

  const renderStationCard = (id: StationId) => {
    const st = stations[id];
    const isMaitri = id === 'maitri';
    const isBreakdownOpen = activeScoreBreakdown === id;

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
      return 'text-red-400 border-red-500/40 bg-red-950/20';
    };

    return (
      <div 
        key={id}
        className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200 relative overflow-hidden"
      >
        {/* Subtle top accent gradient */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          st.operationalStatus === 'CRITICAL' 
            ? 'bg-red-500' 
            : st.operationalStatus === 'WARNING' 
            ? 'bg-amber-500' 
            : 'bg-cyan-500'
        }`} />

        <div>
          {/* Card Top: Name, Flag, Operational Status */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-tech font-bold tracking-wider text-white">
                  🇮🇳 {st.name}
                </span>
                <span className="text-xs font-mono text-cyan-400">({st.code})</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Indian Antarctic Station · {st.location.region}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${
                st.operationalStatus === 'CRITICAL' 
                  ? 'bg-red-500 animate-ping' 
                  : st.operationalStatus === 'WARNING' 
                  ? 'bg-amber-400' 
                  : 'bg-emerald-400'
              }`} />
              <span className={
                st.operationalStatus === 'CRITICAL' 
                  ? 'text-red-400 font-semibold' 
                  : st.operationalStatus === 'WARNING' 
                  ? 'text-amber-400 font-semibold' 
                  : 'text-emerald-400 font-semibold'
              }>
                {st.operationalStatus}
              </span>
            </div>
          </div>

          {/* Station Image Banner */}
          <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-800/80 mb-5">
            <img 
              src={st.image} 
              alt={st.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 text-[11px] font-mono text-cyan-300">
              {st.location.coordinatesText}
            </div>
            <div className="absolute bottom-2 right-2 text-[11px] font-mono text-slate-300">
              Alt: {st.location.elevationMeters}m
            </div>
          </div>

          {/* Operational Score Box (Signature Indicator) */}
          <div 
            onClick={() => setActiveScoreBreakdown(isBreakdownOpen ? null : id)}
            className={`p-3.5 rounded-lg border cursor-pointer transition-colors mb-5 ${getScoreColor(st.whiteoutScore)}`}
            title="Click to view detailed Operational Score diagnostic"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase">
                  WHITEOUT OPERATIONAL SCORE
                </span>
                <HelpCircle className="w-3.5 h-3.5 opacity-70" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xl sm:text-2xl font-bold">
                <span>{st.whiteoutScore}</span>
                <span className="text-xs text-slate-400 font-normal">/ 100</span>
                {isBreakdownOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </div>
            </div>

            {/* Expandable Breakdown Drawer */}
            {isBreakdownOpen && (
              <div className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Power:</span>
                  <span className={st.scoreBreakdown.power.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.power.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Equipment:</span>
                  <span className={st.scoreBreakdown.equipment.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.equipment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Supplies:</span>
                  <span className={st.scoreBreakdown.supplies.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.supplies.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Weather:</span>
                  <span className={st.scoreBreakdown.weather.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.weather.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Communication:</span>
                  <span className={st.scoreBreakdown.communication.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.communication.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Active Alerts:</span>
                  <span className={st.scoreBreakdown.alerts.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {st.scoreBreakdown.alerts.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Six Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5 font-mono">
            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                PERSONNEL
              </span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono-num">
                {st.personnelCount}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                POWER
              </span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono-num">
                {st.powerPercentage}%
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                FUEL
              </span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono-num">
                {st.fuelPercentage}%
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Boxes className="w-3 h-3 text-indigo-400" />
                SUPPLIES
              </span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono-num">
                {st.suppliesPercentage}%
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-sky-400" />
                WEATHER
              </span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono-num">
                {st.weather.temperatureC}°C
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                ALERTS
              </span>
              <span className={`text-base font-bold block mt-0.5 font-mono-num ${
                st.activeAlertsCount > 1 ? 'text-red-400' : 'text-white'
              }`}>
                {st.activeAlertsCount}
              </span>
            </div>
          </div>

          {/* One-Click Station Health Bar */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 mb-5">
            <div className="text-[11px] font-mono text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>ONE-CLICK STATION HEALTH</span>
              <span className="text-emerald-400 font-semibold">ALL CRITICAL SUBSYSTEMS</span>
            </div>
            <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px]">
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${st.scoreBreakdown.power.status === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-slate-400">Power</span>
              </div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${st.scoreBreakdown.communication.status === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-slate-400">Comms</span>
              </div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${st.scoreBreakdown.supplies.status === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-slate-400">Supply</span>
              </div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${st.scoreBreakdown.equipment.status === 'Good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-slate-400">Equip</span>
              </div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${st.scoreBreakdown.weather.status === 'Good' ? 'bg-emerald-500' : 'bg-yellow-400'}`} />
                <span className="text-slate-400">Weath</span>
              </div>
              <div className="p-1 rounded bg-slate-900 border border-slate-800">
                <div className="w-2 h-2 rounded-full mx-auto mb-1 bg-emerald-500" />
                <span className="text-slate-400">Crew</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card CTA Action */}
        <button
          onClick={() => onViewStation(id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer"
        >
          <span>VIEW {st.name} STATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
            STATION COMMAND TERMINALS
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Maitri (Queen Maud Land) & Bharati (Larsemann Hills) operational summaries.
          </p>
        </div>

        <button
          onClick={onOpenCompare}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          <span>COMPARE STATIONS (MAITRI VS BHARATI)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderStationCard('maitri')}
        {renderStationCard('bharati')}
      </div>
    </div>
  );
};
