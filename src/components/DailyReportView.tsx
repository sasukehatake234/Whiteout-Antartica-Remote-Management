import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  RefreshCw, 
  Calendar, 
  Building2, 
  Users, 
  Zap, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useStation } from '../context/StationContext';

export const DailyReportView: React.FC = () => {
  const { stations, priorities, alerts, supplies, equipment } = useStation();
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [reportGenerated, setReportGenerated] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    const rows = [
      ['WHITEOUT - DAILY ANTARCTIC OPERATIONS REPORT'],
      ['Report Date', reportDate],
      ['Generated At', new Date().toUTCString()],
      ['Authority', 'National Centre for Polar and Ocean Research (NCPOR) / Ministry of Earth Sciences'],
      [],
      ['STATION SUMMARY'],
      ['Station', 'Operational Status', 'Whiteout Score', 'Personnel', 'Power %', 'Fuel %', 'Supplies %', 'Surface Temp', 'Alerts Count'],
      [
        stations.maitri.name,
        stations.maitri.operationalStatus,
        stations.maitri.whiteoutScore,
        stations.maitri.personnelCount,
        stations.maitri.powerPercentage,
        stations.maitri.fuelPercentage,
        stations.maitri.suppliesPercentage,
        stations.maitri.weather.temperatureC,
        stations.maitri.activeAlertsCount,
      ],
      [
        stations.bharati.name,
        stations.bharati.operationalStatus,
        stations.bharati.whiteoutScore,
        stations.bharati.personnelCount,
        stations.bharati.powerPercentage,
        stations.bharati.fuelPercentage,
        stations.bharati.suppliesPercentage,
        stations.bharati.weather.temperatureC,
        stations.bharati.activeAlertsCount,
      ],
      [],
      ['WHAT NEEDS ATTENTION - PRIORITY QUEUE'],
      ['ID', 'Station', 'Severity', 'Problem', 'Recommended Action', 'Detected At'],
      ...priorities.map(p => [
        p.id,
        p.stationId.toUpperCase(),
        p.severity,
        `"${p.problem.replace(/"/g, '""')}"`,
        `"${p.recommendedAction.replace(/"/g, '""')}"`,
        p.detectedAt,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WHITEOUT_Antarctic_Report_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Report Controls Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#060a16] p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-tech text-xl font-bold tracking-wider text-white uppercase">
                DAILY ANTARCTIC OPERATIONS REPORT
              </h2>
              <p className="text-xs text-slate-400">
                Official operational synopsis for NCPOR, New Delhi Ministry Headquarters, and Station Commanders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="date"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setReportGenerated(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>GENERATE REPORT</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="rounded-xl border border-slate-800 bg-[#040813] p-6 sm:p-10 shadow-2xl space-y-8 font-sans print:bg-white print:text-black print:p-0">
        
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase">
            <span>GOVERNMENT OF INDIA · MINISTRY OF EARTH SCIENCES</span>
          </div>
          <h1 className="font-tech text-2xl md:text-3xl font-bold tracking-tight text-white uppercase print:text-black">
            INDIAN ANTARCTIC EXPEDITION OPERATIONS BRIEF
          </h1>
          <p className="text-xs font-mono text-slate-400 print:text-slate-600">
            MAITRI & BHARATI STATIONS · 24-HOUR OPERATIONAL LOG · DATE: {reportDate}
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="font-tech text-sm font-bold text-cyan-300 uppercase tracking-wider print:text-black">
            01. EXECUTIVE READINESS & WHITEOUT SCORES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 print:border-slate-300">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">🇮🇳 MAITRI STATION (IN-MTR)</span>
                <span className="text-emerald-400 font-bold">{stations.maitri.operationalStatus}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Whiteout Score: <strong className="text-white">{stations.maitri.whiteoutScore}/100</strong></div>
                <div>Personnel: <strong className="text-white">{stations.maitri.personnelCount}</strong></div>
                <div>Power Output: <strong className="text-white">{stations.maitri.powerPercentage}%</strong></div>
                <div>Fuel Reserves: <strong className="text-white">{stations.maitri.fuelPercentage}%</strong></div>
                <div>Supplies Average: <strong className="text-white">{stations.maitri.suppliesPercentage}%</strong></div>
                <div>Surface Temp: <strong className="text-white">{stations.maitri.weather.temperatureC}°C</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans pt-1">
                Note: Generator #2 maintenance due within 3 days; medical supplies at 31% require logistics attention.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 print:border-slate-300">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">🇮🇳 BHARATI STATION (IN-BHR)</span>
                <span className="text-emerald-400 font-bold">{stations.bharati.operationalStatus}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Whiteout Score: <strong className="text-white">{stations.bharati.whiteoutScore}/100</strong></div>
                <div>Personnel: <strong className="text-white">{stations.bharati.personnelCount}</strong></div>
                <div>Power Output: <strong className="text-white">{stations.bharati.powerPercentage}%</strong></div>
                <div>Fuel Reserves: <strong className="text-white">{stations.bharati.fuelPercentage}%</strong></div>
                <div>Supplies Average: <strong className="text-white">{stations.bharati.suppliesPercentage}%</strong></div>
                <div>Surface Temp: <strong className="text-white">{stations.bharati.weather.temperatureC}°C</strong></div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans pt-1">
                Note: Cogeneration and microgrid stable; auxiliary satcom radome tracking requires periodic de-ice cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Priority Actions Required */}
        <div className="space-y-3">
          <h3 className="font-tech text-sm font-bold text-cyan-300 uppercase tracking-wider print:text-black">
            02. PRIORITY ACTIONS IDENTIFIED BY WHITEOUT ENGINE
          </h3>
          <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
            <div className="grid grid-cols-12 bg-slate-900 p-2.5 font-bold text-slate-300 border-b border-slate-800">
              <div className="col-span-2">STATION</div>
              <div className="col-span-2">SEVERITY</div>
              <div className="col-span-4">PROBLEM & IMPACT</div>
              <div className="col-span-4">RECOMMENDED ACTION</div>
            </div>
            <div className="divide-y divide-slate-800/80 bg-[#040813]">
              {priorities.map(p => (
                <div key={p.id} className="grid grid-cols-12 p-2.5 items-start">
                  <div className="col-span-2 font-bold text-white">🇮🇳 {p.stationId.toUpperCase()}</div>
                  <div className={`col-span-2 font-bold ${
                    p.severity === 'CRITICAL' ? 'text-red-400' : p.severity === 'HIGH' ? 'text-amber-400' : 'text-yellow-400'
                  }`}>
                    {p.severity}
                  </div>
                  <div className="col-span-4 pr-3 text-slate-200 font-sans text-xs">
                    {p.problem}
                  </div>
                  <div className="col-span-4 text-cyan-300 font-sans text-xs">
                    {p.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Critical Logistics & Days Remaining */}
        <div className="space-y-3">
          <h3 className="font-tech text-sm font-bold text-cyan-300 uppercase tracking-wider print:text-black">
            03. CRITICAL SUPPLY RESERVES (DAYS REMAINING)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="font-bold text-slate-200 block mb-1">MAITRI CRITICAL RESERVES</span>
              {supplies.maitri.map(s => (
                <div key={s.id} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-300">{s.name.slice(0, 24)}...</span>
                  <span className={s.status === 'ACTION_REQUIRED' ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {s.currentPercentage}% ({s.estimatedRemainingDays}d remaining)
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 space-y-1">
              <span className="font-bold text-slate-200 block mb-1">BHARATI CRITICAL RESERVES</span>
              {supplies.bharati.map(s => (
                <div key={s.id} className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-300">{s.name.slice(0, 24)}...</span>
                  <span className="text-slate-300">
                    {s.currentPercentage}% ({s.estimatedRemainingDays}d remaining)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Footer Signature */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400 print:text-slate-600">
          <div>
            <span>AUTHORIZED BY: Central Operations Director, NCPOR Goa</span>
          </div>
          <div>
            <span>SYSTEM SIGNATURE: WHITEOUT v1.0.4-AUTHENTICATED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
