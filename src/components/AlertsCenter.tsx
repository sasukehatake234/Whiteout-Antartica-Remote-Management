import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Clock, 
  Zap, 
  Boxes, 
  Radio, 
  Wind 
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { AlertItem, SeverityLevel, StationId } from '../types';

interface AlertsCenterProps {
  onInspectStation: (id: StationId) => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ onInspectStation }) => {
  const { alerts, acknowledgeAlert, selectedStationFilter, setSelectedStationFilter } = useStation();
  const [severityFilter, setSeverityFilter] = useState<'all' | SeverityLevel>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (selectedStationFilter !== 'all' && alert.stationId !== selectedStationFilter) {
      return false;
    }
    if (severityFilter !== 'all' && alert.severity !== severityFilter) {
      return false;
    }
    return true;
  });

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-500/40 flex items-center justify-center text-red-400">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                SMART ALERT DISPATCH CENTER
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated threshold alerts across electrical microgrids, life-support, fuel tanks, and polar atmospheric monitors.
            </p>
          </div>

          {/* Station Filter */}
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

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <span className="text-[11px] text-slate-500 mr-1">SEVERITY:</span>
          {(['all', 'CRITICAL', 'HIGH', 'MONITOR'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase ${
                severityFilter === sev
                  ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}

          {unacknowledgedCount > 0 && (
            <span className="ml-auto text-xs font-mono text-red-400 font-semibold animate-pulse">
              ● {unacknowledgedCount} UNACKNOWLEDGED WARNINGS
            </span>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-slate-800 bg-[#060a16] text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-tech text-base text-white">NO ACTIVE ALERTS MATCHING CRITERIA</p>
            <p className="mt-1">All telemetry thresholds remain within nominal limits.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border bg-[#060a16] space-y-3 shadow-lg transition-all duration-200 ${
                  isCritical
                    ? 'border-red-500/70 bg-red-950/20'
                    : isHigh
                    ? 'border-amber-500/60 bg-amber-950/15'
                    : 'border-yellow-500/40 bg-yellow-950/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-white uppercase tracking-wider">
                      🇮🇳 {alert.stationId.toUpperCase()}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400 uppercase text-[10px] font-semibold">
                      {alert.system}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className={`font-semibold ${isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-yellow-400'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {alert.detectedAt}
                    </span>
                  </div>

                  {alert.acknowledged ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      OPERATOR ACKNOWLEDGED
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-red-400 flex items-center gap-1.5 font-semibold animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      AWAITING OPERATOR ACKNOWLEDGEMENT
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Recommended Action Box */}
                <div className="p-3 rounded-lg bg-[#030611] border border-slate-800 text-xs font-mono">
                  <span className="text-cyan-400 font-bold uppercase text-[10px] block mb-0.5">
                    RECOMMENDED ACTION:
                  </span>
                  <p className="text-slate-200 font-sans">
                    {alert.recommendedAction}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      ACKNOWLEDGE
                    </button>
                  )}

                  <button
                    onClick={() => onInspectStation(alert.stationId)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded text-xs font-mono text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>VIEW {alert.stationId.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
