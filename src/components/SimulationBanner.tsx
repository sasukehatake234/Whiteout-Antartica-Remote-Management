import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, X, ArrowRight } from 'lucide-react';
import { useStation } from '../context/StationContext';

export const SimulationBanner: React.FC = () => {
  const { 
    activeSimulationBanner, 
    dismissSimulationBanner, 
    setActiveTab, 
    setInspectStationId 
  } = useStation();

  if (!activeSimulationBanner) return null;

  const isCritical = activeSimulationBanner.type === 'critical';
  const isWarning = activeSimulationBanner.type === 'warning';
  const isSuccess = activeSimulationBanner.type === 'success';

  return (
    <div className={`relative w-full border-b px-4 py-3 sm:px-6 transition-all duration-300 ${
      isCritical 
        ? 'bg-red-950/70 border-red-500/60 text-red-200' 
        : isWarning 
        ? 'bg-amber-950/70 border-amber-500/60 text-amber-200'
        : isSuccess 
        ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
        : 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {isCritical && <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />}
            {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />}
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {!isCritical && !isWarning && !isSuccess && <Info className="w-5 h-5 text-cyan-400" />}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
            <span className="font-mono font-bold tracking-wider uppercase text-white">
              {activeSimulationBanner.title}
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="text-slate-300 font-sans">
              {activeSimulationBanner.desc}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {activeSimulationBanner.title.includes('MAITRI') && (
            <button
              onClick={() => {
                setInspectStationId('maitri');
                setActiveTab('stations');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 border border-current text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>INSPECT MAITRI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {activeSimulationBanner.title.includes('BHARATI') && (
            <button
              onClick={() => {
                setInspectStationId('bharati');
                setActiveTab('stations');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 hover:bg-black/60 border border-current text-[11px] font-mono font-medium transition-colors cursor-pointer"
            >
              <span>INSPECT BHARATI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={dismissSimulationBanner}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
