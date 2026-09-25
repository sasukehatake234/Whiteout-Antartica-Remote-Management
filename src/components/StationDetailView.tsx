import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Zap, 
  Fuel, 
  Boxes, 
  Thermometer, 
  Wind, 
  Eye, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Wrench, 
  ArrowLeft,
  Scale,
  Send,
  Compass,
  Activity
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface StationDetailViewProps {
  stationId: StationId;
  onBack: () => void;
  onOpenCompare: () => void;
}

export const StationDetailView: React.FC<StationDetailViewProps> = ({ 
  stationId, 
  onBack, 
  onOpenCompare 
}) => {
  const { 
    stations, 
    equipment, 
    supplies, 
    alerts, 
    timeline, 
    acknowledgeAlert, 
    orderSupplyRequisition, 
    scheduleMaintenance,
    setActiveTab
  } = useStation();

  const [activeSection, setActiveSection] = useState<'overview' | 'equipment' | 'logistics' | 'environment' | 'alerts' | 'timeline'>('overview');

  const station = stations[stationId];
  const stationEquipment = equipment.filter(e => e.stationId === stationId);
  const stationSupplies = supplies[stationId] || [];
  const stationAlerts = alerts.filter(a => a.stationId === stationId);
  const stationTimeline = timeline.filter(t => t.stationId === stationId);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      
      {/* Station Header Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full opacity-20 pointer-events-none overflow-hidden">
          <img 
            src={station.image} 
            alt={station.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#060a16]/80 to-[#060a16]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Back to Command Center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-tech text-2xl md:text-3xl font-bold tracking-wider text-white">
                  🇮🇳 {station.fullTitle.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30">
                  {station.code}
                </span>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-400 pl-10 flex flex-wrap items-center gap-2">
              <span>{station.location.region}</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400">{station.location.coordinatesText}</span>
              <span className="text-slate-600">·</span>
              <span>Elevation: {station.location.elevationMeters}m</span>
              <span className="text-slate-600">·</span>
              <span>Commissioned: {station.commissionedYear}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-10 md:pl-0">
            {/* Whiteout Score Badge */}
            <div className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">WHITEOUT SCORE:</span>
              <span className="text-lg font-bold text-cyan-300">{station.whiteoutScore}</span>
              <span className="text-slate-500">/ 100</span>
            </div>

            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>COMPARE STATIONS</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs font-mono">
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'equipment', label: `EQUIPMENT (${stationEquipment.length})` },
            { id: 'logistics', label: `LOGISTICS & DAYS REMAINING (${stationSupplies.length})` },
            { id: 'environment', label: 'ENVIRONMENT & WEATHER' },
            { id: 'alerts', label: `ALERTS (${stationAlerts.length})` },
            { id: 'timeline', label: `TIMELINE (${stationTimeline.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: OVERVIEW */}
      {/* ======================================================== */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                PERSONNEL
              </span>
              <span className="text-xl font-bold text-white block mt-1">{station.personnelCount}</span>
              <span className="text-[10px] text-emerald-400">All accounted</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                POWER
              </span>
              <span className="text-xl font-bold text-white block mt-1">{station.powerPercentage}%</span>
              <span className="text-[10px] text-slate-400">Microgrid CHP</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-3 h-3 text-amber-400" />
                FUEL
              </span>
              <span className="text-xl font-bold text-white block mt-1">{station.fuelPercentage}%</span>
              <span className="text-[10px] text-slate-400">Polar Diesel</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Boxes className="w-3 h-3 text-indigo-400" />
                SUPPLIES
              </span>
              <span className="text-xl font-bold text-white block mt-1">{station.suppliesPercentage}%</span>
              <span className="text-[10px] text-slate-400">Inventory avg</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-sky-400" />
                SURFACE TEMP
              </span>
              <span className="text-xl font-bold text-white block mt-1">{station.weather.temperatureC}°C</span>
              <span className="text-[10px] text-slate-400">Feels {station.weather.apparentTempC}°C</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#060a16] border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                COMMS
              </span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">{station.communicationStatus}</span>
              <span className="text-[10px] text-slate-400">{station.latencyMs}ms GSAT</span>
            </div>
          </div>

          {/* Station Health Diagnostic Breakdown */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#060a16]">
            <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider mb-3">
              STATION SUBSYSTEM HEALTH DIAGNOSTIC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Power Microgrid</span>
                  <span className={station.scoreBreakdown.power.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.power.status} ({station.scoreBreakdown.power.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.power.detail}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Equipment & Machinery</span>
                  <span className={station.scoreBreakdown.equipment.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.equipment.status} ({station.scoreBreakdown.equipment.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.equipment.detail}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Supplies & Reserves</span>
                  <span className={station.scoreBreakdown.supplies.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.supplies.status} ({station.scoreBreakdown.supplies.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.supplies.detail}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Atmospheric & Weather</span>
                  <span className={station.scoreBreakdown.weather.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.weather.status} ({station.scoreBreakdown.weather.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.weather.detail}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">SATCOM & Network</span>
                  <span className={station.scoreBreakdown.communication.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.communication.status} ({station.scoreBreakdown.communication.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.communication.detail}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Active Alert Pressure</span>
                  <span className={station.scoreBreakdown.alerts.status === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>
                    ● {station.scoreBreakdown.alerts.status} ({station.scoreBreakdown.alerts.score}/100)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{station.scoreBreakdown.alerts.detail}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: EQUIPMENT & PREDICTIVE MAINTENANCE */}
      {/* ======================================================== */}
      {activeSection === 'equipment' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                {station.name} STATION EQUIPMENT INVENTORY
              </h3>
              <p className="text-xs text-slate-400">
                Operating cycles, vibration telemetry, and automated predictive maintenance recommendations.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('equipment')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Open Global Equipment Console →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stationEquipment.map(eq => (
              <div
                key={eq.id}
                className="p-4 rounded-xl border border-slate-800 bg-[#060a16] hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{eq.category}</span>
                    <h4 className="font-semibold text-white text-sm">{eq.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    eq.status === 'Operational'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : eq.status === 'Maintenance Due'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      : 'bg-red-950/60 text-red-400 border border-red-500/30'
                  }`}>
                    ● {eq.status}
                  </span>
                </div>

                {/* Operating Stats */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">HEALTH</span>
                    <span className="font-bold text-white">{eq.health}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">HOURS RUN</span>
                    <span className="font-bold text-white">{eq.operatingHours}h</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">NEXT SERVICE</span>
                    <span className={`font-bold ${eq.nextMaintenanceDueDays <= 5 ? 'text-amber-400' : 'text-white'}`}>
                      {eq.nextMaintenanceDueDays} days
                    </span>
                  </div>
                </div>

                {/* Predictive Why Explanation if available */}
                {eq.predictiveWhy && (
                  <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-300">
                    <span className="font-bold block mb-1 uppercase text-[10px]">PREDICTIVE RECOMMENDATION (WHY?):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                      {eq.predictiveWhy.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => scheduleMaintenance(eq.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3 h-3" />
                    <span>SCHEDULE MAINTENANCE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: LOGISTICS & "DAYS REMAINING" */}
      {/* ======================================================== */}
      {activeSection === 'logistics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                {station.name} “DAYS REMAINING” LOGISTICS INTELLIGENCE
              </h3>
              <p className="text-xs text-slate-400">
                Calculated burn rates against Antarctic winter minimum reserve constraints.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('logistics')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Open Global Logistics Console →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stationSupplies.map(sup => {
              const isActionReq = sup.status === 'ACTION_REQUIRED';
              return (
                <div
                  key={sup.id}
                  className={`p-4 rounded-xl border bg-[#060a16] space-y-3 ${
                    isActionReq ? 'border-red-500/50 bg-red-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">{sup.category}</span>
                      <h4 className="font-semibold text-white text-sm">{sup.name}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      isActionReq 
                        ? 'bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse' 
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {sup.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Days remaining countdown */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-500 block">CURRENT STOCK</span>
                      <span className={`text-base font-bold ${isActionReq ? 'text-red-400' : 'text-white'}`}>
                        {sup.currentPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">DAYS REMAINING</span>
                      <span className={`text-base font-bold ${isActionReq ? 'text-red-400' : 'text-emerald-400'}`}>
                        {sup.estimatedRemainingDays} DAYS
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">MIN RESERVE</span>
                      <span className="text-base font-bold text-slate-300">
                        {sup.minimumReserveDays} DAYS
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Burn Rate: {sup.dailyConsumption}</span>
                    <button
                      onClick={() => orderSupplyRequisition(stationId, sup.id)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition-colors cursor-pointer"
                    >
                      REQUEST AIRLIFT REQUISITION
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 4: ENVIRONMENT & METEOROLOGY */}
      {/* ======================================================== */}
      {activeSection === 'environment' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#060a16] space-y-4">
            <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
              {station.name} ENVIRONMENTAL CONDITIONS & OPERATIONS CONNECTION
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SURFACE TEMP</span>
                <span className="text-xl font-bold text-white mt-1 block">{station.weather.temperatureC}°C</span>
                <span className="text-slate-400 text-[10px]">Apparent {station.weather.apparentTempC}°C</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">WIND VELOCITY</span>
                <span className="text-xl font-bold text-white mt-1 block">{station.weather.windSpeedKmh} km/h</span>
                <span className="text-slate-400 text-[10px]">{station.weather.windDirection} Katabatic</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">OPTICAL VISIBILITY</span>
                <span className="text-xl font-bold text-white mt-1 block">{station.weather.visibilityKm} km</span>
                <span className="text-slate-400 text-[10px]">{station.weather.condition}</span>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">BAROMETER</span>
                <span className="text-xl font-bold text-white mt-1 block">{station.weather.barometerHpa} hPa</span>
                <span className="text-slate-400 text-[10px]">Blizzard Risk: {station.weather.blizzardRisk}</span>
              </div>
            </div>

            {/* Direct Operational Impact Callout */}
            <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase block mb-1">
                OPERATIONAL IMPACT DIRECTIVE:
              </span>
              <p className="text-slate-200 font-sans text-sm">
                {station.weather.operationalImpact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 5: ALERTS */}
      {/* ======================================================== */}
      {activeSection === 'alerts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
              {station.name} ACTIVE ALERTS ({stationAlerts.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Simulated Threshold Telemetry
            </span>
          </div>

          {stationAlerts.length === 0 ? (
            <div className="p-6 text-center rounded-lg border border-slate-800 bg-[#060a16] text-slate-400 text-xs">
              No active alerts logged for {station.name}.
            </div>
          ) : (
            stationAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border bg-[#060a16] space-y-2 ${
                  alert.severity === 'CRITICAL'
                    ? 'border-red-500/60 bg-red-950/15'
                    : alert.severity === 'HIGH'
                    ? 'border-amber-500/60 bg-amber-950/15'
                    : 'border-yellow-500/40 bg-yellow-950/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-white uppercase">{alert.system}</span>
                    <span className="text-slate-600">·</span>
                    <span className="font-semibold text-amber-400">{alert.severity}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{alert.detectedAt}</span>
                  </div>
                  {alert.acknowledged ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ACKNOWLEDGED
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                    >
                      ACKNOWLEDGE
                    </button>
                  )}
                </div>

                <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                <p className="text-xs text-slate-300">{alert.description}</p>
                <div className="p-2 rounded bg-slate-900/80 text-xs font-mono text-cyan-300">
                  <span className="text-slate-400 uppercase text-[10px] block">RECOMMENDED ACTION:</span>
                  {alert.recommendedAction}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 6: TIMELINE */}
      {/* ======================================================== */}
      {activeSection === 'timeline' && (
        <div className="p-5 rounded-xl border border-slate-800 bg-[#060a16] space-y-4 font-mono text-xs">
          <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
            {station.name} OPERATIONAL EVENT TIMELINE
          </h3>

          <div className="relative pl-6 border-l border-slate-800 space-y-6">
            {stationTimeline.map(item => (
              <div key={item.id} className="relative group">
                <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#060a16]" />
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span className="text-cyan-400 font-bold">{item.time}</span>
                  <span className="text-slate-600">·</span>
                  <span className="uppercase text-slate-400">{item.type}</span>
                </div>
                <p className="text-slate-200 mt-1 font-sans text-sm">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
