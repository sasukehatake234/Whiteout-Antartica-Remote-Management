import React, { useState, useEffect } from 'react';
import { 
  Snowflake, 
  Search, 
  Bell, 
  Bot, 
  SlidersHorizontal, 
  RotateCcw, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { ActiveTab, StationId } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAICopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAICopilot }) => {
  const { 
    returnToLanding, 
    activeTab, 
    setActiveTab, 
    alerts, 
    simulateEvent,
    selectedStationFilter,
    setSelectedStationFilter
  } = useStation();

  const [currentTimeUTC, setCurrentTimeUTC] = useState<string>('');
  const [currentTimeIST, setCurrentTimeIST] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeUTC(
        now.toUTCString().slice(17, 22) + ' UTC'
      );
      // IST is UTC + 5:30
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      setCurrentTimeIST(
        istTime.toISOString().slice(11, 16) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const unackAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const navLinks: { id: ActiveTab; label: string; badge?: string }[] = [
    { id: 'command-center', label: 'Command Center' },
    { id: 'stations', label: 'Stations' },
    { id: 'strategic-dossier', label: 'Maitri & Bharati Dossier', badge: 'INTEL' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'environment', label: 'Environment' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'reports', label: 'Reports' },
    { id: 'ai-assistant', label: 'Whiteout AI' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#040711]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Zone 1: Brand Title Wordmark */}
        <div className="flex items-center gap-4">
          <button 
            onClick={returnToLanding} 
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Snowflake className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-tech text-xl font-bold tracking-widest text-white leading-none group-hover:text-cyan-300 transition-colors">
                WHITEOUT
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                Antarctic Operations
              </span>
            </div>
          </button>

          {/* Station Quick Filter Selector */}
          <div className="hidden lg:flex items-center p-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono ml-3">
            <button
              onClick={() => setSelectedStationFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setSelectedStationFilter('maitri')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'maitri'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MAITRI
            </button>
            <button
              onClick={() => setSelectedStationFilter('bharati')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedStationFilter === 'bharati'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BHARATI
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Text with hover states) */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium tracking-wide">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`py-1 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Operational Time, Demo Trigger, Search, and AI Copilot */}
        <div className="flex items-center gap-3">
          {/* Operations Clock */}
          <div className="hidden md:flex flex-col text-right font-mono text-[11px] leading-tight pr-2 border-r border-slate-800 text-slate-400">
            <span className="text-cyan-300 font-medium">{currentTimeUTC}</span>
            <span className="text-[10px] text-slate-500">{currentTimeIST} (HQ)</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded transition-colors cursor-pointer"
            title="Search Stations, Equipment, Alerts (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden sm:inline text-[10px] text-slate-500 border border-slate-700 rounded px-1">/</span>
          </button>

          {/* Demo Simulation Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/40 rounded transition-all cursor-pointer"
              title="Simulate events for Hackathon Demo"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">DEMO SIMULATOR</span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-800 bg-[#070b18] p-3 shadow-2xl z-50 text-xs font-mono">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-amber-400 text-[11px]">HACKATHON DEMO TRIGGERS</span>
                  <button 
                    onClick={() => {
                      simulateEvent('reset');
                      setDemoMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">MAITRI SCENARIOS</p>
                  <button
                    onClick={() => {
                      simulateEvent('maitri-generator');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>🔴 Generator #2 Warning</span>
                    <span className="text-[10px] text-red-400">Score 82→67</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateEvent('maitri-medical');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>🔴 Low Medical Supplies</span>
                    <span className="text-[10px] text-orange-400">4d reserve</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateEvent('maitri-weather');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>🌨️ Severe Polar Whiteout</span>
                    <span className="text-[10px] text-cyan-400">94 km/h wind</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateEvent('maitri-comms');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>📡 SATCOM Uplink Jitter</span>
                    <span className="text-[10px] text-yellow-400">Iridium drop</span>
                  </button>

                  <div className="pt-2 border-t border-slate-800" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">BHARATI SCENARIOS</p>
                  <button
                    onClick={() => {
                      simulateEvent('bharati-power');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>⚡ CHP Thermal Leak</span>
                    <span className="text-[10px] text-amber-400">Pressure drop</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateEvent('bharati-equipment');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>🔧 Tracking Radome Icing</span>
                    <span className="text-[10px] text-yellow-400">Servo load</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateEvent('bharati-supplies');
                      setDemoMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between"
                  >
                    <span>⛽ Fuel Reserve Threshold</span>
                    <span className="text-[10px] text-orange-400">16d left</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Center Bell */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Open Alert Center"
          >
            <Bell className="w-4 h-4" />
            {unackAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-mono text-white flex items-center justify-center font-bold animate-pulse">
                {unackAlertsCount}
              </span>
            )}
          </button>

          {/* Whiteout AI Copilot Trigger */}
          <button
            onClick={onOpenAICopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            title="Ask Whiteout AI"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WHITEOUT AI</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#040711] px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between ${
                activeTab === link.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400 px-3">
            <span>Filter:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedStationFilter('all')} 
                className={`px-2 py-0.5 rounded ${selectedStationFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}
              >
                ALL
              </button>
              <button 
                onClick={() => setSelectedStationFilter('maitri')} 
                className={`px-2 py-0.5 rounded ${selectedStationFilter === 'maitri' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}
              >
                MAITRI
              </button>
              <button 
                onClick={() => setSelectedStationFilter('bharati')} 
                className={`px-2 py-0.5 rounded ${selectedStationFilter === 'bharati' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}
              >
                BHARATI
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
