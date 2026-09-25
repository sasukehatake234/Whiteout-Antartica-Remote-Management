import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  Cpu, 
  AlertTriangle, 
  Boxes, 
  Users, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    stations, 
    equipment, 
    alerts, 
    supplies, 
    personnel, 
    setActiveTab, 
    setInspectStationId 
  } = useStation();

  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results
  const stationResults = q
    ? ['maitri' as StationId, 'bharati' as StationId].filter(
        id => stations[id].name.toLowerCase().includes(q) || stations[id].location.region.toLowerCase().includes(q)
      )
    : [];

  const equipmentResults = q
    ? equipment.filter(
        e => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      )
    : [];

  const alertResults = q
    ? alerts.filter(
        a => a.title.toLowerCase().includes(q) || a.system.toLowerCase().includes(q)
      )
    : [];

  const supplyResults = q
    ? [
        ...supplies.maitri.map(s => ({ ...s, stationId: 'maitri' as StationId })),
        ...supplies.bharati.map(s => ({ ...s, stationId: 'bharati' as StationId })),
      ].filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    : [];

  const personnelResults = q
    ? personnel.filter(
        p => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
      )
    : [];

  const dossierResults = q
    ? [
        {
          title: 'Importance of Maitri & Bharati',
          desc: 'Antarctic Treaty consultative status, Lake Priyadarshini oasis, ISRO polar ground station',
          tag: 'Strategic Importance'
        },
        {
          title: 'All Problems Faced At Once (Vulnerability Matrix)',
          desc: 'Katabatic blizzards, 9-month sea-ice impasse, microgrid duty, freshwater freeze, SATCOM jitter',
          tag: 'All Problems Catalog'
        },
        {
          title: 'Subsystem % Error & Telemetry Drift Analyzer',
          desc: 'Quantified ultrasonic drift (7.8%), anemometer ice error (18.4%), thermocouple decay (9.6%)',
          tag: '% Error Benchmarks'
        },
        {
          title: 'Operational Action Plans & SOP Protocols',
          desc: 'SOP-PWR-01, SOP-WAT-02, SOP-ENV-03, SOP-COM-04, SOP-LOG-05, SOP-MED-06 emergency workflows',
          tag: 'Action Plans'
        }
      ].filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.desc.toLowerCase().includes(q) || 
        d.tag.toLowerCase().includes(q) ||
        'dossier'.includes(q) ||
        'problem'.includes(q) ||
        'error'.includes(q) ||
        'action'.includes(q) ||
        'plan'.includes(q) ||
        'sop'.includes(q)
      )
    : [];

  const totalResults =
    stationResults.length +
    equipmentResults.length +
    alertResults.length +
    supplyResults.length +
    personnelResults.length +
    dossierResults.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-800 bg-[#070b18] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stations, equipment, alerts, supplies, personnel (e.g. 'Generator #2')..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white text-xs font-mono"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-4 font-mono text-xs flex-1">
          {!q ? (
            <div className="text-center py-10 text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30" />
              <p>Type keywords to search across Indian Antarctic operations.</p>
              <div className="flex justify-center gap-2 pt-2 text-[11px]">
                <button
                  onClick={() => setQuery('Generator')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-cyan-300"
                >
                  "Generator"
                </button>
                <button
                  onClick={() => setQuery('Medical')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-cyan-300"
                >
                  "Medical"
                </button>
                <button
                  onClick={() => setQuery('Maitri')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-cyan-300"
                >
                  "Maitri"
                </button>
                <button
                  onClick={() => setQuery('Bharati')}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-cyan-300"
                >
                  "Bharati"
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-slate-400">
              No matching stations, equipment, or supplies found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Strategic Dossier Matches */}
              {dossierResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                    STRATEGIC DOSSIER & ACTION PLANS
                  </span>
                  {dossierResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('strategic-dossier');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-between group transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-bold">{item.title}</span>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Station Matches */}
              {stationResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">STATIONS</span>
                  {stationResults.map(id => (
                    <button
                      key={id}
                      onClick={() => {
                        setInspectStationId(id);
                        setActiveTab('stations');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-bold">{stations[id].name} STATION</span>
                        <span className="text-slate-400">({stations[id].location.region})</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Equipment Matches */}
              {equipmentResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">EQUIPMENT</span>
                  {equipmentResults.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab('equipment');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-emerald-400" />
                          <span className="text-white font-semibold">{item.name}</span>
                          <span className="text-slate-500">[{item.stationId.toUpperCase()}]</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          Status: {item.status} · Operating Hours: {item.operatingHours}h · Health: {item.health}%
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Supplies Matches */}
              {supplyResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">LOGISTICS & SUPPLIES</span>
                  {supplyResults.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveTab('logistics');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-indigo-400" />
                          <span className="text-white font-semibold">{s.name}</span>
                          <span className="text-slate-500">[{s.stationId.toUpperCase()}]</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          Current Stock: {s.currentPercentage}% ({s.estimatedRemainingDays} days remaining)
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Alerts Matches */}
              {alertResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">ACTIVE ALERTS</span>
                  {alertResults.map(a => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setActiveTab('alerts');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-white font-semibold">{a.title}</span>
                          <span className="text-amber-400">[{a.severity}]</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {a.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Personnel Matches */}
              {personnelResults.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">PERSONNEL</span>
                  {personnelResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveTab('personnel');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-semibold">{p.name}</span>
                          <span className="text-slate-400">({p.role})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {p.department} · {p.stationId.toUpperCase()} · Shift: {p.shift}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#040813] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Press ESC to close</span>
          <span>WHITEOUT Operational Search</span>
        </div>
      </div>
    </div>
  );
};
