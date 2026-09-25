import React from 'react';
import { 
  Building2, 
  Users, 
  Zap, 
  Boxes, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';
import { useStation } from '../context/StationContext';

export const CommandCenterKPIs: React.FC = () => {
  const { stations, alerts, equipment, supplies, setActiveTab } = useStation();

  const totalPersonnel = stations.maitri.personnelCount + stations.bharati.personnelCount;
  const avgPower = Math.round((stations.maitri.powerPercentage + stations.bharati.powerPercentage) / 2);
  const avgSupplies = Math.round((stations.maitri.suppliesPercentage + stations.bharati.suppliesPercentage) / 2);
  
  const allEquipment = equipment;
  const operationalCount = allEquipment.filter(e => e.status === 'Operational').length;
  const maintenanceCount = allEquipment.filter(e => e.status === 'Maintenance Due' || e.status === 'Warning').length;

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highAlerts = alerts.filter(a => a.severity === 'HIGH').length;
  const monitorAlerts = alerts.filter(a => a.severity === 'MONITOR').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Active Stations */}
      <div 
        onClick={() => setActiveTab('stations')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">ACTIVE STATIONS</span>
          <Building2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold text-white font-mono-num">2 / 2</span>
          <span className="text-[10px] text-emerald-400 font-medium">100% ONLINE</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
          Maitri & Bharati active
        </div>
      </div>

      {/* 2. Personnel */}
      <div 
        onClick={() => setActiveTab('personnel')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">PERSONNEL</span>
          <Users className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold text-white font-mono-num">{totalPersonnel}</span>
          <span className="text-[10px] text-slate-400 font-medium">DEPLOYED</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
          42 Maitri · 38 Bharati
        </div>
      </div>

      {/* 3. Power */}
      <div 
        onClick={() => setActiveTab('equipment')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">STATION POWER</span>
          <Zap className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold text-white font-mono-num">{avgPower}%</span>
          <span className="text-[10px] text-emerald-400 font-medium">CHP & DIESEL</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
          M: {stations.maitri.powerPercentage}% · B: {stations.bharati.powerPercentage}%
        </div>
      </div>

      {/* 4. Critical Supplies */}
      <div 
        onClick={() => setActiveTab('logistics')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">AVG SUPPLIES</span>
          <Boxes className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold text-white font-mono-num">{avgSupplies}%</span>
          <span className="text-[10px] text-amber-400 font-medium">MED RESERVE LOW</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
          Fuel: 71% · Food: 83%
        </div>
      </div>

      {/* 5. Equipment */}
      <div 
        onClick={() => setActiveTab('equipment')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">EQUIPMENT</span>
          <Cpu className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className="text-2xl font-bold text-white font-mono-num">{operationalCount}</span>
          <span className="text-[10px] text-slate-400 font-mono">/ {allEquipment.length} ACTIVE</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-400 font-mono truncate">
          {maintenanceCount} maintenance advisory
        </div>
      </div>

      {/* 6. Active Alerts */}
      <div 
        onClick={() => setActiveTab('alerts')}
        className="p-3.5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-red-500/40 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="uppercase text-[10px]">ACTIVE ALERTS</span>
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
          <span className={`text-2xl font-bold font-mono-num ${criticalAlerts > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {alerts.length}
          </span>
          <span className="text-[10px] text-red-400 font-medium font-mono">
            {criticalAlerts} CRIT · {highAlerts} HIGH
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 font-mono truncate">
          {monitorAlerts} monitoring tasks
        </div>
      </div>
    </div>
  );
};
