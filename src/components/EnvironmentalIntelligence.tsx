import React, { useState } from 'react';
import { 
  ThermometerSnowflake, 
  Wind, 
  Eye, 
  Satellite, 
  Compass, 
  Layers, 
  AlertTriangle, 
  Sliders, 
  Info,
  Maximize2
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

export const EnvironmentalIntelligence: React.FC = () => {
  const { stations, selectedStationFilter, setSelectedStationFilter } = useStation();
  
  // Slider position (0 - 100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [selectedStation, setSelectedStation] = useState<StationId>('maitri');

  const st = stations[selectedStation];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <ThermometerSnowflake className="w-4 h-4" />
              </div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                ENVIRONMENTAL INTELLIGENCE & SATELLITE COMPARISON
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Remote sensing satellite imagery and synoptic meteorology connected directly to operational safety thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
              DEMO DATA / OPEN SATELLITE ARCHIVE
            </span>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER ENVIRONMENT SLIDER COMPONENT */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                SATELLITE REMOTE SENSING: BEFORE / AFTER OBSERVATION
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40">
                CHANGE DETECTED
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Drag the center slider to inspect regional sea ice fracturing and seasonal thermal shifts.
            </p>
          </div>

          {/* Region Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setSelectedStation('maitri')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStation === 'maitri'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MAITRI REGION (Queen Maud Land)
            </button>
            <button
              onClick={() => setSelectedStation('bharati')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStation === 'bharati'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BHARATI REGION (Prydz Bay / Larsemann)
            </button>
          </div>
        </div>

        {/* Interactive Before / After Split View */}
        <div 
          className="relative w-full h-[360px] sm:h-[480px] rounded-lg overflow-hidden border border-slate-800 select-none cursor-ew-resize group"
          onMouseMove={e => {
            if (e.buttons === 1) handleSliderMove(e);
          }}
          onClick={handleSliderMove}
        >
          {/* Base Layer: CURRENT Satellite Observation (Right side) */}
          <img
            src="/src/assets/images/antarctica_sat_curr_1790348584669.jpg"
            alt="Current Satellite Earth Observation"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay Layer: HISTORICAL Observation (Clipped to left side of slider) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src="/src/assets/images/antarctica_sat_hist_1790348570980.jpg"
              alt="Historical Satellite Earth Observation"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%', minWidth: '100%' }}
            />
            {/* Historical Label Pill */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/70 border border-slate-700 text-xs font-mono text-white backdrop-blur-sm shadow-lg">
              HISTORICAL BASELINE (Previous Polar Season)
            </div>
          </div>

          {/* Current Label Pill */}
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/70 border border-cyan-500/40 text-xs font-mono text-cyan-300 backdrop-blur-sm shadow-lg">
            CURRENT OBSERVATION (Today / Latest Pass)
          </div>

          {/* Draggable Vertical Divider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Center Handle Knob */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-white">
              ⇄
            </div>
          </div>

          {/* Bottom HUD Coordinates */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded bg-black/75 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
            Target Sector: {st.location.coordinatesText} · Optical / SAR Polar Orbit
          </div>
        </div>

        {/* Change Detected Explanation Box */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-amber-500/30">
            <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              OBSERVED CHANGE DETECTED IN SELECTED REGION:
            </span>
            <span className="text-slate-400 text-[11px]">
              Analysis Period: Previous Season vs. Current Pass
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-200">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">SURFACE THERMAL ANOMALY</span>
              <span className="text-base font-bold text-amber-400 font-mono-num">+1.8°C</span>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Elevated thermal radiation measured on coastal rock nunataks.
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">SEA ICE COVERAGE VARIANCE</span>
              <span className="text-base font-bold text-cyan-300 font-mono-num">-12.4% Fast-Ice</span>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Rift fractures expanding along shelf front; coastal lead opening.
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">OPERATIONAL IMPACT</span>
              <span className="text-base font-bold text-white">Traverse Caution</span>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                PistenBully vehicular sea-ice routes require ground-penetrating radar survey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Conditions Linked Directly to Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Maitri Weather & Operational Directive */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#060a16] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-tech text-base font-bold text-white uppercase">
                🇮🇳 MAITRI ENVIRONMENTAL DIRECTIVE
              </h4>
              <p className="text-xs text-slate-400 font-mono">Schirmacher Oasis · Continental Plateau Rim</p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40">
              MODERATE RISK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TEMP</span>
              <span className="text-base font-bold text-white">{stations.maitri.weather.temperatureC}°C</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">WIND</span>
              <span className="text-base font-bold text-white">{stations.maitri.weather.windSpeedKmh} km/h</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">VISIBILITY</span>
              <span className="text-base font-bold text-white">{stations.maitri.weather.visibilityKm} km</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono">
            <span className="text-cyan-400 font-bold block mb-1 uppercase text-[10px]">
              ENVIRONMENT → OPERATION IMPACT:
            </span>
            <p className="text-slate-200 font-sans">
              {stations.maitri.weather.operationalImpact}
            </p>
          </div>
        </div>

        {/* Bharati Weather & Operational Directive */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#060a16] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h4 className="font-tech text-base font-bold text-white uppercase">
                🇮🇳 BHARATI ENVIRONMENTAL DIRECTIVE
              </h4>
              <p className="text-xs text-slate-400 font-mono">Larsemann Hills · Prydz Bay Maritime Promontory</p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40">
              LOW RISK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TEMP</span>
              <span className="text-base font-bold text-white">{stations.bharati.weather.temperatureC}°C</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">WIND</span>
              <span className="text-base font-bold text-white">{stations.bharati.weather.windSpeedKmh} km/h</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">VISIBILITY</span>
              <span className="text-base font-bold text-white">{stations.bharati.weather.visibilityKm} km</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono">
            <span className="text-cyan-400 font-bold block mb-1 uppercase text-[10px]">
              ENVIRONMENT → OPERATION IMPACT:
            </span>
            <p className="text-slate-200 font-sans">
              {stations.bharati.weather.operationalImpact}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
