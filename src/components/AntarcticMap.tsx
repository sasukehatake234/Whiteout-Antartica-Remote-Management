import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Wind, 
  Thermometer, 
  Satellite, 
  Info,
  ArrowRight
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface AntarcticMapProps {
  onSelectStation: (id: StationId) => void;
}

export const AntarcticMap: React.FC<AntarcticMapProps> = ({ onSelectStation }) => {
  const { stations } = useStation();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'weather' | 'satellite' | 'seaice'>('all');
  const [hoveredStation, setHoveredStation] = useState<StationId | null>(null);

  // Status colors helper
  const getMarkerColor = (id: StationId) => {
    const st = stations[id];
    if (st.operationalStatus === 'CRITICAL') return { fill: '#ef4444', ring: 'rgba(239, 68, 68, 0.4)' };
    if (st.operationalStatus === 'WARNING') return { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.4)' };
    if (st.whiteoutScore < 75) return { fill: '#eab308', ring: 'rgba(234, 179, 8, 0.4)' };
    return { fill: '#10b981', ring: 'rgba(16, 185, 129, 0.4)' };
  };

  const maitriColor = getMarkerColor('maitri');
  const bharatiColor = getMarkerColor('bharati');

  return (
    <div className="relative w-full rounded-xl border border-slate-800 bg-[#060a16] p-4 sm:p-5 shadow-2xl overflow-hidden">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-tech text-base font-bold text-white uppercase tracking-wider">
              ANTARCTIC CONTINENTAL OPERATIONS THEATER
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30">
              POLAR PROJECTION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time geospatial monitoring of Indian Antarctic research stations: Maitri (Queen Maud Land) & Bharati (Larsemann Hills).
          </p>
        </div>

        {/* Layer Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
          <span className="text-[11px] text-slate-500 px-1 hidden md:inline">LAYERS:</span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              activeLayer === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveLayer('weather')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
              activeLayer === 'weather' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            Weather
          </button>
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
              activeLayer === 'satellite' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Satellite className="w-3 h-3" />
            Thermal
          </button>
          <button
            onClick={() => setActiveLayer('seaice')}
            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
              activeLayer === 'seaice' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sea Ice
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div className="relative w-full h-[360px] sm:h-[440px] rounded-lg bg-[#030611] border border-slate-800/80 overflow-hidden flex items-center justify-center">
        
        {/* Polar SVG Map */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full select-none"
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.3s ease-out' }}
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#040a1c" />
              <stop offset="100%" stopColor="#02040a" />
            </radialGradient>

            <radialGradient id="iceSheetGrad" cx="45%" cy="52%" r="48%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.85" />
              <stop offset="90%" stopColor="#09101f" stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="traversePath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Southern Ocean Background */}
          <rect width="800" height="600" fill="url(#oceanGrad)" />

          {/* Polar Latitude Rings (60°S, 70°S, 80°S) */}
          <g stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" fill="none">
            <circle cx="400" cy="300" r="260" strokeDasharray="3,3" />
            <circle cx="400" cy="300" r="190" strokeDasharray="3,3" />
            <circle cx="400" cy="300" r="110" strokeDasharray="3,3" />
            <line x1="400" y1="30" x2="400" y2="570" strokeDasharray="2,4" />
            <line x1="130" y1="300" x2="670" y2="300" strokeDasharray="2,4" />
          </g>

          {/* Latitude Labels */}
          <text x="405" y="55" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontFamily="monospace">60°S</text>
          <text x="405" y="125" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontFamily="monospace">70°S</text>
          <text x="405" y="205" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontFamily="monospace">80°S</text>
          <text x="405" y="303" fill="rgba(56, 189, 248, 0.6)" fontSize="10" fontFamily="monospace" fontWeight="bold">SOUTH POLE 90°S</text>
          <circle cx="400" cy="300" r="3" fill="#38bdf8" />

          {/* Sea Ice Margin (Winter Pack Ice Extent) */}
          {(activeLayer === 'all' || activeLayer === 'seaice') && (
            <path
              d="M 210,120 C 330,80 500,70 630,150 C 720,220 730,360 670,460 C 600,560 410,570 270,520 C 140,460 90,320 120,210 Z"
              fill="none"
              stroke="rgba(186, 230, 253, 0.18)"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          )}

          {/* Continental Antarctica Coastline & Ice Shelf Body */}
          <path
            d="M 260,165 
               C 310,140 370,145 420,155 
               C 490,165 560,195 600,245 
               C 640,290 630,360 590,410 
               C 550,460 480,485 410,480 
               C 330,475 270,440 230,390 
               C 190,340 185,270 210,215 
               Z"
            fill="url(#iceSheetGrad)"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1.5"
            filter="url(#glow)"
          />

          {/* Major Geographical Features / Ice Shelves */}
          {/* Fimbul & Riiser-Larsen Ice Shelves near Maitri */}
          <path
            d="M 285,160 Q 320,170 350,162"
            fill="none"
            stroke="rgba(147, 197, 253, 0.4)"
            strokeWidth="1.2"
          />
          {/* Amery Ice Shelf & Prydz Bay near Bharati */}
          <path
            d="M 540,225 Q 565,245 580,230"
            fill="none"
            stroke="rgba(147, 197, 253, 0.4)"
            strokeWidth="1.2"
          />

          {/* Weather Katabatic Streamlines (when active) */}
          {(activeLayer === 'all' || activeLayer === 'weather') && (
            <g stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1" fill="none">
              <path d="M 380,280 Q 340,230 300,185" strokeDasharray="3,3" />
              <path d="M 420,290 Q 480,270 540,235" strokeDasharray="3,3" />
              <path d="M 400,320 Q 370,390 320,440" strokeDasharray="3,3" />
            </g>
          )}

          {/* Thermal / Satellite Anomaly Overlay */}
          {activeLayer === 'satellite' && (
            <g>
              <ellipse cx="560" cy="235" rx="40" ry="25" fill="rgba(244, 63, 94, 0.15)" stroke="rgba(244, 63, 94, 0.4)" strokeWidth="1" strokeDasharray="2,2" />
              <text x="535" y="215" fill="#f43f5e" fontSize="9" fontFamily="monospace">+1.8°C ANOMALY</text>
            </g>
          )}

          {/* Inter-Station Traverse / Communication Vector Line */}
          <line
            x1="305"
            y1="175"
            x2="560"
            y2="238"
            stroke="url(#traversePath)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text 
            x="425" 
            y="200" 
            fill="rgba(186, 230, 253, 0.7)" 
            fontSize="9" 
            fontFamily="monospace"
            textAnchor="middle"
          >
            AIR & SATELLITE CORRIDOR: ~3,000 km
          </text>

          {/* ========================================================= */}
          {/* STATION 1: MAITRI RESEARCH STATION (Queen Maud Land) */}
          {/* Coordinates scaled to canvas: X=305, Y=175 */}
          {/* ========================================================= */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSelectStation('maitri')}
            onMouseEnter={() => setHoveredStation('maitri')}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Status Pulse Ring */}
            <circle
              cx="305"
              cy="175"
              r="18"
              fill={maitriColor.ring}
              className="animate-ping opacity-60"
            />
            {/* Radial Radar Target Ring */}
            <circle
              cx="305"
              cy="175"
              r="12"
              fill="none"
              stroke={maitriColor.fill}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            {/* Center Pin */}
            <circle
              cx="305"
              cy="175"
              r="5"
              fill={maitriColor.fill}
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Station Callout Flag */}
            <g transform="translate(305, 175)">
              <line x1="0" y1="0" x2="-25" y2="-32" stroke="#38bdf8" strokeWidth="1" />
              <rect 
                x="-125" 
                y="-60" 
                width="100" 
                height="28" 
                rx="3" 
                fill="#070c1e" 
                stroke={hoveredStation === 'maitri' ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'} 
                strokeWidth="1"
              />
              <text x="-120" y="-46" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                🇮🇳 MAITRI
              </text>
              <text x="-120" y="-36" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                SCORE: {stations.maitri.whiteoutScore} · {stations.maitri.weather.temperatureC}°C
              </text>
            </g>
          </g>

          {/* ========================================================= */}
          {/* STATION 2: BHARATI RESEARCH STATION (Larsemann Hills) */}
          {/* Coordinates scaled to canvas: X=560, Y=238 */}
          {/* ========================================================= */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSelectStation('bharati')}
            onMouseEnter={() => setHoveredStation('bharati')}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Status Pulse Ring */}
            <circle
              cx="560"
              cy="238"
              r="18"
              fill={bharatiColor.ring}
              className="animate-ping opacity-60"
            />
            {/* Radial Radar Target Ring */}
            <circle
              cx="560"
              cy="238"
              r="12"
              fill="none"
              stroke={bharatiColor.fill}
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            {/* Center Pin */}
            <circle
              cx="560"
              cy="238"
              r="5"
              fill={bharatiColor.fill}
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Station Callout Flag */}
            <g transform="translate(560, 238)">
              <line x1="0" y1="0" x2="25" y2="-32" stroke="#38bdf8" strokeWidth="1" />
              <rect 
                x="25" 
                y="-60" 
                width="100" 
                height="28" 
                rx="3" 
                fill="#070c1e" 
                stroke={hoveredStation === 'bharati' ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'} 
                strokeWidth="1"
              />
              <text x="30" y="-46" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                🇮🇳 BHARATI
              </text>
              <text x="30" y="-36" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                SCORE: {stations.bharati.whiteoutScore} · {stations.bharati.weather.temperatureC}°C
              </text>
            </g>
          </g>

          {/* Compass Rose */}
          <g transform="translate(80, 520)">
            <circle cx="0" cy="0" r="22" fill="#04091a" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1" />
            <polygon points="0,-18 3,-5 -3,-5" fill="#38bdf8" />
            <text x="0" y="-24" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle">GRID N</text>
          </g>
        </svg>

        {/* HUD Overlay Bottom Left: Coordinates & Scale */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 bg-[#040816]/90 border border-slate-800 px-3 py-2 rounded text-[11px] font-mono backdrop-blur-sm">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>MAITRI: 70°45′58″ S, 11°43′56″ E</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>BHARATI: 69°24′29″ S, 76°11′14″ E</span>
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex justify-between">
            <span>ISRO SAC REMOTE SENSING</span>
            <span>DEMO SIMULATION</span>
          </div>
        </div>

        {/* Zoom Controls Overlay Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#040816]/90 border border-slate-800 p-1 rounded backdrop-blur-sm">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.85))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Footer: Quick Station Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onSelectStation('maitri')}
          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: maitriColor.fill }} />
            <div>
              <div className="text-xs font-tech font-bold text-white group-hover:text-cyan-300 transition-colors">
                MAITRI STATION (Queen Maud Land)
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Score: {stations.maitri.whiteoutScore} · {stations.maitri.personnelCount} Crew · {stations.maitri.weather.temperatureC}°C
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => onSelectStation('bharati')}
          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bharatiColor.fill }} />
            <div>
              <div className="text-xs font-tech font-bold text-white group-hover:text-cyan-300 transition-colors">
                BHARATI STATION (Larsemann Hills)
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Score: {stations.bharati.whiteoutScore} · {stations.bharati.personnelCount} Crew · {stations.bharati.weather.temperatureC}°C
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};
