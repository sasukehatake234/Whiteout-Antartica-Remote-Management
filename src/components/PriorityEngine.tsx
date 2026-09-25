import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Clock, 
  Wrench, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId, PriorityIssue } from '../types';

interface PriorityEngineProps {
  onInspectStation: (id: StationId) => void;
  onOpenEquipment?: (stationId: StationId) => void;
  onOpenLogistics?: (stationId: StationId) => void;
}

export const PriorityEngine: React.FC<PriorityEngineProps> = ({ 
  onInspectStation,
  onOpenEquipment,
  onOpenLogistics 
}) => {
  const { 
    priorities, 
    resolvePriority, 
    selectedStationFilter, 
    setSelectedStationFilter,
    setActiveTab,
    setInspectStationId
  } = useStation();

  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  // Filter priorities based on station
  const filteredPriorities = priorities.filter(p => {
    if (selectedStationFilter === 'all') return true;
    return p.stationId === selectedStationFilter;
  });

  const criticalCount = filteredPriorities.filter(p => p.severity === 'CRITICAL').length;
  const highCount = filteredPriorities.filter(p => p.severity === 'HIGH').length;
  const monitorCount = filteredPriorities.filter(p => p.severity === 'MONITOR').length;

  const handleActionClick = (issue: PriorityIssue) => {
    if (issue.category === 'power' || issue.category === 'equipment') {
      setActiveTab('equipment');
    } else if (issue.category === 'supplies') {
      setActiveTab('logistics');
    } else if (issue.category === 'weather') {
      setActiveTab('environment');
    } else {
      setInspectStationId(issue.stationId);
      setActiveTab('stations');
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#060a16] p-4 sm:p-6 shadow-xl">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                  WHAT NEEDS ATTENTION?
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
                  PRIORITY ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Automated continuous operational triage across Maitri and Bharati stations.
              </p>
            </div>
          </div>
        </div>

        {/* Severity Metrics & Station Segmented Control */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {criticalCount} CRITICAL
              </span>
            )}
            {highCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {highCount} HIGH
              </span>
            )}
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-950/40 border border-yellow-500/30 text-yellow-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              {monitorCount} MONITOR
            </span>
          </div>

          {/* Station Filter Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedStationFilter('all')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedStationFilter('maitri')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'maitri'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MAITRI
            </button>
            <button
              onClick={() => setSelectedStationFilter('bharati')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'bharati'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BHARATI
            </button>
          </div>
        </div>
      </div>

      {/* Priority Issues List */}
      <div className="space-y-3">
        {filteredPriorities.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-slate-800 bg-slate-950/40">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-tech text-base text-white">ALL OPERATIONAL SYSTEMS NOMINAL</p>
            <p className="text-xs text-slate-400 mt-1">
              No outstanding critical or high severity items require operator action at this time.
            </p>
          </div>
        ) : (
          filteredPriorities.map(issue => {
            const isCritical = issue.severity === 'CRITICAL';
            const isHigh = issue.severity === 'HIGH';
            const isMonitor = issue.severity === 'MONITOR';
            const isExpanded = expandedIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className={`rounded-lg border transition-all duration-200 ${
                  isCritical
                    ? 'border-red-500/50 bg-red-950/15 hover:border-red-400'
                    : isHigh
                    ? 'border-amber-500/50 bg-amber-950/15 hover:border-amber-400'
                    : 'border-yellow-500/30 bg-yellow-950/10 hover:border-yellow-400/50'
                }`}
              >
                <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Station & Problem */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="pt-0.5 flex-shrink-0">
                      {isCritical && (
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                        </span>
                      )}
                      {isHigh && <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />}
                      {isMonitor && <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" />}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-white uppercase tracking-wider">
                          🇮🇳 {issue.stationId.toUpperCase()}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className={`font-semibold ${
                          isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-yellow-400'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {issue.detectedAt}
                        </span>
                      </div>

                      <h3 className="font-medium text-slate-100 text-sm sm:text-base leading-snug">
                        {issue.problem}
                      </h3>

                      <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
                        <strong className="text-slate-300 font-medium">Why it matters:</strong> {issue.whyItMatters}
                      </p>

                      {/* Recommended Action Snippet */}
                      <div className="mt-2 p-2.5 rounded bg-[#030611]/80 border border-slate-800 text-xs">
                        <span className="text-cyan-400 font-mono font-medium uppercase tracking-wider text-[11px] block mb-0.5">
                          RECOMMENDED ACTION:
                        </span>
                        <span className="text-slate-200">
                          {issue.recommendedAction}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 lg:flex-col lg:items-end flex-shrink-0 pt-2 lg:pt-0">
                    <button
                      onClick={() => handleActionClick(issue)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => resolvePriority(issue.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
                      title="Log action executed and resolve priority item"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>RESOLVE</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
