import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  MapPin, 
  Scale, 
  FileText, 
  Bell, 
  Boxes, 
  Wrench, 
  Bot,
  ArrowRight
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { CommandCenterKPIs } from './CommandCenterKPIs';
import { PriorityEngine } from './PriorityEngine';
import { AntarcticMap } from './AntarcticMap';
import { StationCommandCards } from './StationCommandCards';
import { StationId } from '../types';

interface CommandCenterDashboardProps {
  onInspectStation: (id: StationId) => void;
  onOpenCompare: () => void;
  onOpenAICopilot: () => void;
}

export const CommandCenterDashboard: React.FC<CommandCenterDashboardProps> = ({
  onInspectStation,
  onOpenCompare,
  onOpenAICopilot,
}) => {
  const { setActiveTab } = useStation();

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Top Telemetry KPI Summary Cards */}
      <CommandCenterKPIs />

      {/* 2. SIGNATURE FEATURE: WHAT NEEDS ATTENTION? (Priority Engine) */}
      <PriorityEngine 
        onInspectStation={onInspectStation} 
        onOpenEquipment={id => {
          onInspectStation(id);
          setActiveTab('equipment');
        }}
        onOpenLogistics={id => {
          onInspectStation(id);
          setActiveTab('logistics');
        }}
      />

      {/* 3. Interactive Continental Antarctic Map */}
      <AntarcticMap onSelectStation={onInspectStation} />

      {/* 4. Two-Station Command Center Cards (Maitri + Bharati) */}
      <StationCommandCards 
        onViewStation={onInspectStation} 
        onOpenCompare={onOpenCompare} 
      />

      {/* 5. Fixed Quick Action Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-lg">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="uppercase text-[11px] font-bold text-slate-300">QUICK ACTION BAR:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>+ REPORT</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-red-400" />
            <span>⚠ ALERTS</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-indigo-400" />
            <span>📦 SUPPLIES</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>🔧 MAINTENANCE</span>
          </button>

          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>🤖 WHITEOUT AI</span>
          </button>
        </div>
      </div>

    </div>
  );
};
