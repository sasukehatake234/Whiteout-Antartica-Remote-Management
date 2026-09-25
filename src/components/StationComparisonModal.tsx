import React from 'react';
import { X, Scale, ArrowRight, ShieldCheck, Thermometer, Zap, Fuel, Boxes, AlertTriangle, Users } from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface StationComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (id: StationId) => void;
}

export const StationComparisonModal: React.FC<StationComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectStation,
}) => {
  const { stations } = useStation();

  if (!isOpen) return null;

  const maitri = stations.maitri;
  const bharati = stations.bharati;

  const comparisonRows = [
    {
      metric: 'Operational Status',
      maitri: maitri.operationalStatus,
      bharati: bharati.operationalStatus,
      isStatus: true,
    },
    {
      metric: 'Whiteout Operational Score',
      maitri: `${maitri.whiteoutScore} / 100`,
      bharati: `${bharati.whiteoutScore} / 100`,
      highlight: true,
    },
    {
      metric: 'Wintering Personnel',
      maitri: `${maitri.personnelCount} Crew`,
      bharati: `${bharati.personnelCount} Crew`,
    },
    {
      metric: 'Microgrid Power Level',
      maitri: `${maitri.powerPercentage}%`,
      bharati: `${bharati.powerPercentage}%`,
    },
    {
      metric: 'Polar Fuel Reserves',
      maitri: `${maitri.fuelPercentage}% (24 days remaining)`,
      bharati: `${bharati.fuelPercentage}% (38 days remaining)`,
    },
    {
      metric: 'Critical Supplies Average',
      maitri: `${maitri.suppliesPercentage}% (Medical stock low)`,
      bharati: `${bharati.suppliesPercentage}% (Nominal stockpiles)`,
    },
    {
      metric: 'Active Alerts',
      maitri: `${maitri.activeAlertsCount} active warnings`,
      bharati: `${bharati.activeAlertsCount} active advisory`,
    },
    {
      metric: 'Current Surface Temperature',
      maitri: `${maitri.weather.temperatureC}°C (Feels like ${maitri.weather.apparentTempC}°C)`,
      bharati: `${bharati.weather.temperatureC}°C (Feels like ${bharati.weather.apparentTempC}°C)`,
    },
    {
      metric: 'Sustained Wind Velocity',
      maitri: `${maitri.weather.windSpeedKmh} km/h ${maitri.weather.windDirection}`,
      bharati: `${bharati.weather.windSpeedKmh} km/h ${bharati.weather.windDirection}`,
    },
    {
      metric: 'Optical Visibility',
      maitri: `${maitri.weather.visibilityKm} km (Drifting Snow)`,
      bharati: `${bharati.weather.visibilityKm} km (Clear Horizon)`,
    },
    {
      metric: 'Communication Link',
      maitri: `${maitri.communicationStatus} (${maitri.latencyMs}ms GSAT-3.8m)`,
      bharati: `${bharati.communicationStatus} (${bharati.latencyMs}ms GSAT C-Band)`,
    },
    {
      metric: 'Commissioned Year',
      maitri: '1989 (7th Indian Expedition)',
      bharati: '2012 (31st Indian Expedition)',
    },
    {
      metric: 'Primary Fresh Water Source',
      maitri: 'Priyadarshini Glacial Lake (Piped with trace heater)',
      bharati: 'Sea Water Desalination (Dual Reverse Osmosis Units)',
    },
    {
      metric: 'Location & Geography',
      maitri: 'Schirmacher Oasis, Queen Maud Land (Inland Rock)',
      bharati: 'Larsemann Hills, Princess Elizabeth Land (Coastal Promontory)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-xl border border-slate-800 bg-[#070b18] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
                STATION COMPARISON MATRIX
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Side-by-side operational telemetry analysis for Maitri and Bharati (No ranking, purely operational).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs">
          <div className="w-full border border-slate-800 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-900/90 border-b border-slate-800 p-3 font-tech font-bold text-white tracking-wider">
              <div className="col-span-4 text-slate-400 uppercase text-[11px]">OPERATIONAL PARAMETER</div>
              <div className="col-span-4 text-center text-cyan-300 flex items-center justify-center gap-2">
                <span>🇮🇳 MAITRI STATION</span>
              </div>
              <div className="col-span-4 text-center text-cyan-300 flex items-center justify-center gap-2">
                <span>🇮🇳 BHARATI STATION</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-800/80 bg-[#040814]">
              {comparisonRows.map((row, idx) => (
                <div 
                  key={idx}
                  className={`grid grid-cols-12 p-3 items-center hover:bg-slate-900/40 transition-colors ${
                    row.highlight ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <div className="col-span-4 font-sans text-slate-300 font-medium">
                    {row.metric}
                  </div>
                  <div className="col-span-4 text-center text-slate-200">
                    {row.isStatus ? (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.maitri === 'OPERATIONAL' ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                      }`}>
                        ● {row.maitri}
                      </span>
                    ) : (
                      <span className={row.highlight ? 'text-cyan-300 font-bold text-sm' : ''}>
                        {row.maitri}
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 text-center text-slate-200">
                    {row.isStatus ? (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.bharati === 'OPERATIONAL' ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                      }`}>
                        ● {row.bharati}
                      </span>
                    ) : (
                      <span className={row.highlight ? 'text-cyan-300 font-bold text-sm' : ''}>
                        {row.bharati}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Jump Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-5">
            <button
              onClick={() => {
                onClose();
                onSelectStation('maitri');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>OPEN MAITRI CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onSelectStation('bharati');
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>OPEN BHARATI CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
