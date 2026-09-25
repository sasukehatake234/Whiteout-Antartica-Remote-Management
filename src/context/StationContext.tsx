import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  StationData, 
  SupplyItem, 
  EquipmentItem, 
  AlertItem, 
  PriorityIssue, 
  PersonnelMember, 
  OperationalEvent,
  StationId,
  ActiveTab
} from '../types';
import { 
  INITIAL_STATIONS, 
  INITIAL_PRIORITIES, 
  INITIAL_ALERTS, 
  INITIAL_SUPPLIES, 
  INITIAL_EQUIPMENT, 
  INITIAL_PERSONNEL, 
  INITIAL_TIMELINE 
} from '../data/initialData';

export type SimulatedEventType = 
  | 'maitri-generator'
  | 'maitri-medical'
  | 'maitri-weather'
  | 'maitri-comms'
  | 'bharati-power'
  | 'bharati-equipment'
  | 'bharati-supplies'
  | 'bharati-comms'
  | 'reset';

interface StationContextType {
  // Navigation & View State
  isLandingPage: boolean;
  enterCommandCenter: () => void;
  returnToLanding: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedStationFilter: 'all' | StationId;
  setSelectedStationFilter: (filter: 'all' | StationId) => void;
  inspectStationId: StationId | null;
  setInspectStationId: (id: StationId | null) => void;
  isComparingStations: boolean;
  setIsComparingStations: (compare: boolean) => void;
  
  // Data State
  stations: Record<StationId, StationData>;
  priorities: PriorityIssue[];
  alerts: AlertItem[];
  supplies: Record<StationId, SupplyItem[]>;
  equipment: EquipmentItem[];
  personnel: PersonnelMember[];
  timeline: OperationalEvent[];
  
  // Quick Actions & Mutations
  acknowledgeAlert: (alertId: string) => void;
  resolvePriority: (priorityId: string) => void;
  orderSupplyRequisition: (stationId: StationId, supplyId: string) => void;
  scheduleMaintenance: (equipmentId: string) => void;
  simulateEvent: (event: SimulatedEventType) => void;
  activeSimulationBanner: { title: string; desc: string; type: string } | null;
  dismissSimulationBanner: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export const StationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('command-center');
  const [selectedStationFilter, setSelectedStationFilter] = useState<'all' | StationId>('all');
  const [inspectStationId, setInspectStationId] = useState<StationId | null>(null);
  const [isComparingStations, setIsComparingStations] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [stations, setStations] = useState<Record<StationId, StationData>>(INITIAL_STATIONS);
  const [priorities, setPriorities] = useState<PriorityIssue[]>(INITIAL_PRIORITIES);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [supplies, setSupplies] = useState<Record<StationId, SupplyItem[]>>(INITIAL_SUPPLIES);
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [personnel, setPersonnel] = useState<PersonnelMember[]>(INITIAL_PERSONNEL);
  const [timeline, setTimeline] = useState<OperationalEvent[]>(INITIAL_TIMELINE);
  const [activeSimulationBanner, setActiveSimulationBanner] = useState<{ title: string; desc: string; type: string } | null>(null);

  const enterCommandCenter = () => {
    setIsLandingPage(false);
  };

  const returnToLanding = () => {
    setIsLandingPage(true);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    // Also add to timeline
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      const newEvent: OperationalEvent = {
        id: `evt-${Date.now()}`,
        time: 'Just now',
        stationId: targetAlert.stationId,
        type: 'alert',
        message: `Alert acknowledged by operator: "${targetAlert.title}"`,
      };
      setTimeline(prev => [newEvent, ...prev]);
    }
  };

  const resolvePriority = (priorityId: string) => {
    const targetPrio = priorities.find(p => p.id === priorityId);
    setPriorities(prev => prev.filter(p => p.id !== priorityId));
    if (targetPrio) {
      const newEvent: OperationalEvent = {
        id: `evt-${Date.now()}`,
        time: 'Just now',
        stationId: targetPrio.stationId,
        type: 'maintenance',
        message: `Action executed for priority issue: "${targetPrio.problem}"`,
      };
      setTimeline(prev => [newEvent, ...prev]);
    }
  };

  const orderSupplyRequisition = (stationId: StationId, supplyId: string) => {
    setSupplies(prev => ({
      ...prev,
      [stationId]: prev[stationId].map(s => {
        if (s.id === supplyId) {
          return {
            ...s,
            status: 'MONITOR',
            currentPercentage: Math.min(100, s.currentPercentage + 15),
            estimatedRemainingDays: s.estimatedRemainingDays + 14,
          };
        }
        return s;
      }),
    }));

    const sItem = supplies[stationId].find(s => s.id === supplyId);
    const newEvent: OperationalEvent = {
      id: `evt-${Date.now()}`,
      time: 'Just now',
      stationId,
      type: 'supply',
      message: `Emergency air-bridge requisition logged for ${sItem ? sItem.name : 'supplies'}. Cape Town logistics hub notified.`,
    };
    setTimeline(prev => [newEvent, ...prev]);

    setActiveSimulationBanner({
      title: 'REQUISITION CONFIRMED',
      desc: `Simulated resupply requisition queued for ${stationId.toUpperCase()}. Estimated airlift window: Next weather clearance.`,
      type: 'success',
    });
  };

  const scheduleMaintenance = (equipmentId: string) => {
    setEquipment(prev => prev.map(eq => {
      if (eq.id === equipmentId) {
        return {
          ...eq,
          status: 'Operational',
          health: 95,
          nextMaintenanceDueDays: 60,
          lastMaintenanceDaysAgo: 0,
        };
      }
      return eq;
    }));

    const eqItem = equipment.find(e => e.id === equipmentId);
    if (eqItem) {
      const newEvent: OperationalEvent = {
        id: `evt-${Date.now()}`,
        time: 'Just now',
        stationId: eqItem.stationId,
        type: 'maintenance',
        message: `Service protocol completed on ${eqItem.name}. Telemetry reset to nominal.`,
      };
      setTimeline(prev => [newEvent, ...prev]);

      // If Maitri generator was resolved, also update score
      if (eqItem.id === 'eq-m-2') {
        setStations(prev => ({
          ...prev,
          maitri: {
            ...prev.maitri,
            whiteoutScore: 91,
            scoreBreakdown: {
              ...prev.maitri.scoreBreakdown,
              equipment: { status: 'Good', score: 94, detail: 'Generator #2 overhauled and recalibrated' },
            },
          },
        }));
      }

      setActiveSimulationBanner({
        title: 'MAINTENANCE DISPATCHED',
        desc: `Work order dispatched to on-station engineering crew for ${eqItem.name}. Health restored to 95%.`,
        type: 'success',
      });
    }
  };

  const simulateEvent = (eventType: SimulatedEventType) => {
    if (eventType === 'reset') {
      setStations(INITIAL_STATIONS);
      setPriorities(INITIAL_PRIORITIES);
      setAlerts(INITIAL_ALERTS);
      setSupplies(INITIAL_SUPPLIES);
      setEquipment(INITIAL_EQUIPMENT);
      setPersonnel(INITIAL_PERSONNEL);
      setTimeline(INITIAL_TIMELINE);
      setActiveSimulationBanner({
        title: 'BASELINE RESTORED',
        desc: 'All station telemetry, alerts, and priority queues reset to standard baseline state.',
        type: 'info',
      });
      return;
    }

    if (eventType === 'maitri-generator') {
      // Critical Generator 2 Warning / Failure
      setStations(prev => ({
        ...prev,
        maitri: {
          ...prev.maitri,
          operationalStatus: 'WARNING',
          statusText: 'Power Grid Degraded — Generator #2 Thermal Overload',
          whiteoutScore: 67,
          powerPercentage: 71,
          activeAlertsCount: prev.maitri.activeAlertsCount + 1,
          scoreBreakdown: {
            ...prev.maitri.scoreBreakdown,
            power: { status: 'Warning', score: 58, detail: 'Generator #2 offline; single Caterpillar unit carrying station critical load' },
            equipment: { status: 'Warning', score: 52, detail: 'Thermal breaker tripped on Gen #2 alternator' },
            alerts: { status: 'Warning', score: 54, detail: 'Critical power alert active' },
          },
        },
      }));

      const newAlert: AlertItem = {
        id: `alt-sim-${Date.now()}`,
        stationId: 'maitri',
        system: 'Primary Power Generation',
        severity: 'CRITICAL',
        title: 'Generator #2 Emergency Shutdown / Abnormal Status',
        description: 'Exhaust temp spiked past 580°C; vibration monitor reached 5.4 mm/s. Engine tripped automatically.',
        recommendedAction: 'Inspect generator and evaluate backup power availability immediately.',
        detectedAt: 'Just now (Simulated)',
        acknowledged: false,
        active: true,
      };

      const newPriority: PriorityIssue = {
        id: `prio-sim-${Date.now()}`,
        stationId: 'maitri',
        problem: 'Generator #2 Abnormal Operating Status & Thermal Shutdown',
        severity: 'CRITICAL',
        whyItMatters: 'Maitri station power output dropped to 71%. Habitability heating and water pipeline heat tracing at risk if load exceeds single generator.',
        recommendedAction: 'Inspect generator and evaluate backup power availability. Isolate non-essential scientific loads.',
        detectedAt: 'Just now (Simulated)',
        category: 'power',
      };

      setEquipment(prev => prev.map(e => e.id === 'eq-m-2' ? {
        ...e,
        status: 'Warning',
        health: 38,
        metrics: [
          { label: 'Power Output', value: '0 kW [TRIPPED]' },
          { label: 'Bearing Vibration', value: '5.4 mm/s [CRITICAL]' },
          { label: 'Coolant Temp', value: '108°C' },
        ],
      } : e));

      setAlerts(prev => [newAlert, ...prev]);
      setPriorities(prev => [newPriority, ...prev.filter(p => p.id !== 'prio-1')]);

      const newEvent: OperationalEvent = {
        id: `evt-${Date.now()}`,
        time: 'Just now',
        stationId: 'maitri',
        type: 'alert',
        message: 'SIMULATION EVENT: Generator #2 at Maitri triggered automatic thermal cutoff. Power reduced to 71%.',
      };
      setTimeline(prev => [newEvent, ...prev]);

      setActiveSimulationBanner({
        title: '⚠️ CRITICAL ALERT: MAITRI GENERATOR TRIP',
        desc: 'Maitri Whiteout Score dropped 82 → 67. Generator #2 abnormal condition detected. Recommended action: Inspect generator and evaluate backup power availability.',
        type: 'critical',
      });
    }

    if (eventType === 'maitri-medical') {
      // Low Medical Supplies
      setSupplies(prev => ({
        ...prev,
        maitri: prev.maitri.map(s => s.category === 'medical' ? {
          ...s,
          currentPercentage: 18,
          estimatedRemainingDays: 4,
          status: 'ACTION_REQUIRED',
        } : s),
      }));

      setStations(prev => ({
        ...prev,
        maitri: {
          ...prev.maitri,
          suppliesPercentage: 59,
          whiteoutScore: 71,
          scoreBreakdown: {
            ...prev.maitri.scoreBreakdown,
            supplies: { status: 'Warning', score: 54, detail: 'Medical oxygen down to 4 days estimated reserve' },
          },
        },
      }));

      const newPriority: PriorityIssue = {
        id: `prio-sim-med-${Date.now()}`,
        stationId: 'maitri',
        problem: 'Emergency Medical & Oxygen Supplies Depleted to 18% (4 Days Remaining)',
        severity: 'CRITICAL',
        whyItMatters: 'Approaching absolute zero reserve; severe health vulnerability for 42 wintering crew members.',
        recommendedAction: 'Trigger inter-station emergency supply sortie or immediate C-130 Hercules airdrop coordination.',
        detectedAt: 'Just now (Simulated)',
        category: 'supplies',
      };
      setPriorities(prev => [newPriority, ...prev.filter(p => p.category !== 'supplies')]);

      setActiveSimulationBanner({
        title: '🔴 CRITICAL LOGISTICS: MAITRI MEDICAL SUPPLY DROP',
        desc: 'Medical inventory at Maitri dropped to 18% (4 days left). Minimum reserve is 14 days. Priority Engine flagged CRITICAL.',
        type: 'critical',
      });
    }

    if (eventType === 'maitri-weather') {
      // Severe Weather / Whiteout Blizzard
      setStations(prev => ({
        ...prev,
        maitri: {
          ...prev.maitri,
          whiteoutScore: 69,
          weather: {
            ...prev.maitri.weather,
            temperatureC: -34,
            apparentTempC: -51,
            windSpeedKmh: 94,
            visibilityKm: 0.1,
            condition: 'Severe Polar Whiteout Blizzard',
            blizzardRisk: 'Severe',
            operationalImpact: 'TOTAL OUTDOOR LOCKDOWN. Surface sorties banned; safety guideline cords mandatory.',
          },
          scoreBreakdown: {
            ...prev.maitri.scoreBreakdown,
            weather: { status: 'Warning', score: 42, detail: 'Katabatic blizzard 94 km/h; zero visibility whiteout' },
          },
        },
      }));

      const newAlert: AlertItem = {
        id: `alt-sim-wth-${Date.now()}`,
        stationId: 'maitri',
        system: 'Environmental / Meteorological',
        severity: 'CRITICAL',
        title: 'Severe Polar Whiteout Blizzard Triggered',
        description: 'Sustained wind velocity 94 km/h with gusts exceeding 120 km/h. Optical visibility 100 meters.',
        recommendedAction: 'Enforce Station Condition RED: Zero outdoor transit. Lock external airlocks.',
        detectedAt: 'Just now (Simulated)',
        acknowledged: false,
        active: true,
      };
      setAlerts(prev => [newAlert, ...prev]);

      setActiveSimulationBanner({
        title: '🌨️ SEVERE BLIZZARD ALERT: MAITRI IN WHITEOUT',
        desc: 'Katabatic windstorm reached 94 km/h with -51°C windchill. Outdoor activities suspended. Station in shelter-in-place.',
        type: 'warning',
      });
    }

    if (eventType === 'maitri-comms') {
      // Maitri Comms Outage
      setStations(prev => ({
        ...prev,
        maitri: {
          ...prev.maitri,
          communicationStatus: 'Degraded',
          latencyMs: 1450,
          whiteoutScore: 73,
          scoreBreakdown: {
            ...prev.maitri.scoreBreakdown,
            communication: { status: 'Warning', score: 48, detail: 'GSAT primary uplink lost lock; fallen back to 9.6kbps Iridium voice loop' },
          },
        },
      }));

      setActiveSimulationBanner({
        title: '📡 COMMS DEGRADATION: MAITRI SATELLITE LINK',
        desc: 'Primary GSAT 3.8m dish lost carrier lock. High-bandwidth scientific stream paused. Backup Iridium channel maintaining heartbeat.',
        type: 'warning',
      });
    }

    if (eventType === 'bharati-power') {
      // Bharati Power Warning
      setStations(prev => ({
        ...prev,
        bharati: {
          ...prev.bharati,
          powerPercentage: 78,
          whiteoutScore: 74,
          operationalStatus: 'WARNING',
          scoreBreakdown: {
            ...prev.bharati.scoreBreakdown,
            power: { status: 'Warning', score: 62, detail: 'CHP Turbine unit beta coolant leak advisory' },
          },
        },
      }));

      const newAlert: AlertItem = {
        id: `alt-sim-bh-pwr-${Date.now()}`,
        stationId: 'bharati',
        system: 'Power / Combined Heat & Power',
        severity: 'HIGH',
        title: 'CHP Thermal Recovery Loop Pressure Drop',
        description: 'Auxiliary cooling line pressure dipped to 1.6 bar. Cogeneration thermal efficiency reduced by 22%.',
        recommendedAction: 'Inspect secondary manifold valves and switch habitat heating to resistive electric backup.',
        detectedAt: 'Just now (Simulated)',
        acknowledged: false,
        active: true,
      };
      setAlerts(prev => [newAlert, ...prev]);

      setActiveSimulationBanner({
        title: '⚡ POWER WARNING: BHARATI CHP SYSTEM',
        desc: 'Bharati thermal loop pressure drop detected. Whiteout Score adjusted to 74. Recommended: Switch habitat loop to backup.',
        type: 'warning',
      });
    }

    if (eventType === 'bharati-equipment') {
      // Bharati Comms & Radome Warning
      setEquipment(prev => prev.map(e => e.id === 'eq-b-2' ? {
        ...e,
        status: 'Warning',
        health: 54,
        metrics: [
          { label: 'Azimuth Deviation', value: '0.45° [HIGH ERROR]' },
          { label: 'Radome Temp', value: '-2.4°C [ICE BUILDUP]' },
        ],
      } : e));

      setStations(prev => ({
        ...prev,
        bharati: {
          ...prev.bharati,
          whiteoutScore: 79,
          scoreBreakdown: {
            ...prev.bharati.scoreBreakdown,
            equipment: { status: 'Monitor', score: 68, detail: 'Satellite radome ice build-up causing servo overload' },
          },
        },
      }));

      setActiveSimulationBanner({
        title: '🔧 EQUIPMENT WARNING: BHARATI RADOME',
        desc: 'Sub-zero rime icing detected on Bharati satellite radome. Dish azimuth servo motor draw elevated. Recommended: Trigger thermal de-ice.',
        type: 'warning',
      });
    }

    if (eventType === 'bharati-supplies') {
      // Bharati Low Fuel / Supplies
      setSupplies(prev => ({
        ...prev,
        bharati: prev.bharati.map(s => s.category === 'fuel' ? {
          ...s,
          currentPercentage: 34,
          estimatedRemainingDays: 16,
          status: 'ACTION_REQUIRED',
        } : s),
      }));

      setStations(prev => ({
        ...prev,
        bharati: {
          ...prev.bharati,
          fuelPercentage: 34,
          whiteoutScore: 76,
          scoreBreakdown: {
            ...prev.bharati.scoreBreakdown,
            supplies: { status: 'Warning', score: 60, detail: 'Polar diesel reserves down to 16 days' },
          },
        },
      }));

      setActiveSimulationBanner({
        title: '⛽ LOGISTICS WARNING: BHARATI FUEL AT 34%',
        desc: 'Bharati CHP fuel reserve fell to 16 days remaining against 20-day minimum reserve limit. Logistics review required.',
        type: 'warning',
      });
    }

    if (eventType === 'bharati-comms') {
      setStations(prev => ({
        ...prev,
        bharati: {
          ...prev.bharati,
          communicationStatus: 'Degraded',
          latencyMs: 1200,
          whiteoutScore: 78,
        },
      }));

      setActiveSimulationBanner({
        title: '📡 BHARATI SATELLITE TELEMETRY JITTER',
        desc: 'Telemetry downlink displaying 1,200ms latency. Ground station ISRO link operating on degraded secondary carrier.',
        type: 'warning',
      });
    }
  };

  const dismissSimulationBanner = () => {
    setActiveSimulationBanner(null);
  };

  const value = useMemo(() => ({
    isLandingPage,
    enterCommandCenter,
    returnToLanding,
    activeTab,
    setActiveTab,
    selectedStationFilter,
    setSelectedStationFilter,
    inspectStationId,
    setInspectStationId,
    isComparingStations,
    setIsComparingStations,
    stations,
    priorities,
    alerts,
    supplies,
    equipment,
    personnel,
    timeline,
    acknowledgeAlert,
    resolvePriority,
    orderSupplyRequisition,
    scheduleMaintenance,
    simulateEvent,
    activeSimulationBanner,
    dismissSimulationBanner,
    searchQuery,
    setSearchQuery,
  }), [
    isLandingPage,
    activeTab,
    selectedStationFilter,
    inspectStationId,
    isComparingStations,
    stations,
    priorities,
    alerts,
    supplies,
    equipment,
    personnel,
    timeline,
    activeSimulationBanner,
    searchQuery,
  ]);

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
};

export const useStation = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStation must be used within a StationProvider');
  }
  return context;
};
