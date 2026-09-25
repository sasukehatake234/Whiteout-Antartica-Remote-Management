import React, { useState } from 'react';
import { StationProvider, useStation } from './context/StationContext';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { SimulationBanner } from './components/SimulationBanner';
import { CommandCenterDashboard } from './components/CommandCenterDashboard';
import { StationDetailView } from './components/StationDetailView';
import { StationComparisonModal } from './components/StationComparisonModal';
import { LogisticsDashboard } from './components/LogisticsDashboard';
import { EquipmentDashboard } from './components/EquipmentDashboard';
import { EnvironmentalIntelligence } from './components/EnvironmentalIntelligence';
import { AlertsCenter } from './components/AlertsCenter';
import { PersonnelModule } from './components/PersonnelModule';
import { DailyReportView } from './components/DailyReportView';
import { WhiteoutAICopilot } from './components/WhiteoutAICopilot';
import { StationStrategicDossier } from './components/StationStrategicDossier';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { StationId } from './types';

const MainAppContent: React.FC = () => {
  const { 
    isLandingPage, 
    activeTab, 
    setActiveTab, 
    inspectStationId, 
    setInspectStationId,
    isComparingStations,
    setIsComparingStations
  } = useStation();

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // If user is on the Cinematic Landing Page
  if (isLandingPage) {
    return <LandingPage />;
  }

  const handleInspectStation = (id: StationId) => {
    setInspectStationId(id);
    setActiveTab('stations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromStationDetail = () => {
    setInspectStationId(null);
    setActiveTab('command-center');
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header 
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAICopilot={() => setActiveTab('ai-assistant')}
      />

      {/* Simulated Event Live Notification Banner */}
      <SimulationBanner />

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
        
        {/* Active Tab Router */}
        {activeTab === 'command-center' && (
          <CommandCenterDashboard
            onInspectStation={handleInspectStation}
            onOpenCompare={() => setIsComparingStations(true)}
            onOpenAICopilot={() => setActiveTab('ai-assistant')}
          />
        )}

        {activeTab === 'stations' && (
          inspectStationId ? (
            <StationDetailView
              stationId={inspectStationId}
              onBack={handleBackFromStationDetail}
              onOpenCompare={() => setIsComparingStations(true)}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider">
                    INDIAN ANTARCTIC RESEARCH STATIONS
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Select a station below for in-depth engineering telemetry, life support, and equipment diagnostics.
                  </p>
                </div>
                <button
                  onClick={() => setIsComparingStations(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                >
                  COMPARE MAITRI VS BHARATI
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setInspectStationId('maitri')}
                  className="p-5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-all cursor-pointer group space-y-4"
                >
                  <div className="h-44 rounded-lg overflow-hidden border border-slate-800 relative">
                    <img 
                      src="/src/assets/images/maitri_station_pod_1790348597098.jpg" 
                      alt="Maitri Station"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="font-tech text-xl font-bold text-white">MAITRI RESEARCH STATION</span>
                      <p className="text-xs font-mono text-cyan-300">Schirmacher Oasis · Commissioned 1989</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">WHITEOUT SCORE: 82</span>
                    <span className="text-cyan-400 font-bold group-hover:underline">OPEN CONSOLE →</span>
                  </div>
                </div>

                <div 
                  onClick={() => setInspectStationId('bharati')}
                  className="p-5 rounded-xl border border-slate-800 bg-[#060a16] hover:border-cyan-500/40 transition-all cursor-pointer group space-y-4"
                >
                  <div className="h-44 rounded-lg overflow-hidden border border-slate-800 relative">
                    <img 
                      src="/src/assets/images/bharati_station_pod_1790348607568.jpg" 
                      alt="Bharati Station"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="font-tech text-xl font-bold text-white">BHARATI RESEARCH STATION</span>
                      <p className="text-xs font-mono text-cyan-300">Larsemann Hills · Commissioned 2012</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">WHITEOUT SCORE: 87</span>
                    <span className="text-cyan-400 font-bold group-hover:underline">OPEN CONSOLE →</span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'personnel' && <PersonnelModule />}

        {activeTab === 'equipment' && <EquipmentDashboard />}

        {activeTab === 'logistics' && <LogisticsDashboard />}

        {activeTab === 'environment' && <EnvironmentalIntelligence />}

        {activeTab === 'alerts' && <AlertsCenter onInspectStation={handleInspectStation} />}

        {activeTab === 'maintenance' && <EquipmentDashboard />}

        {activeTab === 'reports' && <DailyReportView />}

        {activeTab === 'strategic-dossier' && <StationStrategicDossier />}

        {activeTab === 'ai-assistant' && <WhiteoutAICopilot />}
      </main>

      {/* Global Modals */}
      <StationComparisonModal
        isOpen={isComparingStations}
        onClose={() => setIsComparingStations(false)}
        onSelectStation={handleInspectStation}
      />

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Bottom Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#030611] px-4 py-3 mt-12 text-xs font-mono text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            WHITEOUT · Remote Intelligence for Indian Antarctic Stations (Maitri & Bharati)
          </div>
          <div>
            Demo Simulation Mode · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StationProvider>
      <MainAppContent />
    </StationProvider>
  );
}
