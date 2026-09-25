import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  UserCheck 
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

export const PersonnelModule: React.FC = () => {
  const { personnel, stations, selectedStationFilter, setSelectedStationFilter } = useStation();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchCrew, setSearchCrew] = useState<string>('');

  const filteredPersonnel = personnel.filter(p => {
    if (selectedStationFilter !== 'all' && p.stationId !== selectedStationFilter) {
      return false;
    }
    if (departmentFilter !== 'all' && p.department !== departmentFilter) {
      return false;
    }
    if (searchCrew.trim()) {
      const q = searchCrew.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPersonnel = stations.maitri.personnelCount + stations.bharati.personnelCount;
  const activeCount = 76; // Demo active
  const offDutyCount = 3;
  const pendingSafety = 1; // Tsering Dorje

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                PERSONNEL & CREW READINESS MODULE
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Accountability and safety check verification for 80 wintering Indian expedition members across Maitri and Bharati.
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
              ALL CREW (80)
            </button>
            <button
              onClick={() => setSelectedStationFilter('maitri')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'maitri' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              MAITRI (42)
            </button>
            <button
              onClick={() => setSelectedStationFilter('bharati')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'bharati' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              BHARATI (38)
            </button>
          </div>
        </div>

        {/* Status KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">TOTAL PERSONNEL</span>
            <span className="text-lg font-bold text-white font-mono-num">{totalPersonnel}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">ON-DUTY / ACTIVE</span>
            <span className="text-lg font-bold text-emerald-400 font-mono-num">{activeCount}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">OFF-DUTY ROTATION</span>
            <span className="text-lg font-bold text-slate-300 font-mono-num">{offDutyCount}</span>
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">SAFETY CHECK PENDING</span>
            <span className="text-lg font-bold text-amber-400 font-mono-num">{pendingSafety}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-[11px] text-slate-500">DEPARTMENT:</span>
            {['all', 'Operations', 'Science', 'Engineering', 'Logistics', 'Medical'].map(dept => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase ${
                  departmentFilter === dept
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchCrew}
              onChange={e => setSearchCrew(e.target.value)}
              placeholder="Search personnel by name / role..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-64 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Personnel Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPersonnel.map(person => (
          <div
            key={person.id}
            className="p-4 rounded-xl border border-slate-800 bg-[#060a16] shadow-md space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="font-bold text-cyan-400 uppercase">
                    🇮🇳 {person.stationId.toUpperCase()}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 uppercase">{person.department}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mt-0.5">{person.name}</h3>
                <p className="text-xs text-slate-300 font-medium">{person.role}</p>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                person.status === 'Active'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : person.status === 'Off-duty'
                  ? 'bg-slate-900 text-slate-400 border border-slate-800'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              }`}>
                ● {person.status}
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Shift Rotation:</span>
                <span className="text-slate-200">{person.shift}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Emergency Blood Grp:</span>
                <span className="text-slate-200">{person.bloodGroup}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Polar Safety Check:</span>
                <span className={person.safetyCheckCompleted ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                  {person.safetyCheckCompleted ? 'VERIFIED' : 'PENDING CHECK-IN'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
