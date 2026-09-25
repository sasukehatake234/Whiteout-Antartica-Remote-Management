import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Percent, 
  ClipboardList, 
  Snowflake, 
  Flame, 
  Zap, 
  Radio, 
  Waves, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Activity, 
  Sliders, 
  Play, 
  RotateCcw, 
  Layers, 
  Check, 
  Info,
  Calendar,
  ThermometerSnowflake,
  Wind,
  Droplets,
  Server,
  FileText,
  Printer
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface ProblemItem {
  id: string;
  title: string;
  category: 'Weather & Climate' | 'Power & Microgrid' | 'Water & Life Support' | 'Logistics & Isolation' | 'Comms & Ionosphere' | 'Structural & Marine' | 'Crew & Psychological';
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  stations: 'Both Maitri & Bharati' | 'Maitri Only (Schirmacher)' | 'Bharati Only (Larsemann)';
  rootCause: string;
  immediateImpact: string;
  nominalTolerance: string;
  observedPercentError: number; // e.g. 14.8%
  peakErrorCondition: string;
  actionPlanId: string;
}

interface ActionPlan {
  id: string;
  code: string;
  title: string;
  triggerCondition: string;
  errorThreshold: string;
  phase1: string; // 0-15 min
  phase2: string; // 15-60 min
  phase3: string; // 1-4 hours
  centralCommandRole: string;
  failoverRedundancy: string;
  checklist: string[];
}

export const StationStrategicDossier: React.FC = () => {
  const { stations, setInspectStationId, setActiveTab, simulateEvent } = useStation();

  // Active sub-navigation
  const [activeSection, setActiveSection] = useState<'overview' | 'importance' | 'problems' | 'error-analyzer' | 'action-plans'>('overview');
  const [selectedStationFilter, setSelectedStationFilter] = useState<'all' | 'maitri' | 'bharati'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeActionPlanId, setActiveActionPlanId] = useState<string>('sop-pwr-01');

  // Interactive Live Stress Simulator
  const [simWindSpeed, setSimWindSpeed] = useState<number>(65); // km/h
  const [simTemperature, setSimTemperature] = useState<number>(-28); // °C
  const [simDaysIsolated, setSimDaysIsolated] = useState<number>(180); // days
  const [executedPlans, setExecutedPlans] = useState<Record<string, boolean>>({});

  // Dynamic % error calculation based on environmental sliders
  const dynamicTelemetryError = useMemo(() => {
    // Base error 4.5% + wind impact + temperature impact
    const windPenalty = Math.max(0, (simWindSpeed - 40) * 0.14);
    const tempPenalty = Math.max(0, Math.abs(simTemperature) - 20) * 0.22;
    return Math.min(38.5, Number((4.5 + windPenalty + tempPenalty).toFixed(1)));
  }, [simWindSpeed, simTemperature]);

  const dynamicFailureProbability = useMemo(() => {
    const baseRisk = 6.2;
    const isolationPenalty = (simDaysIsolated / 270) * 8.5;
    const windPenalty = Math.max(0, (simWindSpeed - 50) * 0.18);
    const tempPenalty = Math.max(0, Math.abs(simTemperature) - 25) * 0.28;
    return Math.min(84.0, Number((baseRisk + isolationPenalty + windPenalty + tempPenalty).toFixed(1)));
  }, [simWindSpeed, simTemperature, simDaysIsolated]);

  // Comprehensive Catalog of All Problems Faced Simultaneously
  const PROBLEMS: ProblemItem[] = [
    {
      id: 'prob-katabatic',
      title: 'Extreme Katabatic Blizzards & Zero-Visibility Whiteouts',
      category: 'Weather & Climate',
      severity: 'CRITICAL',
      stations: 'Both Maitri & Bharati',
      rootCause: 'Gravity-driven cold air drainage rushing from the 3,000m polar ice sheet down to coastal shelves, exceeding 160-190 km/h with windchill below -60°C.',
      immediateImpact: 'Total loss of visual bearings outside main module; structural shearing force on antenna towers; ice blinding of intake louvers; personnel trapped if outdoors.',
      nominalTolerance: '±2.0 km/h sensor margin',
      observedPercentError: 18.4,
      peakErrorCondition: 'Ultrasonic anemometer rime ice accumulation distorting acoustic transit time by up to 18.4% without heated de-icing cycles.',
      actionPlanId: 'sop-env-03'
    },
    {
      id: 'prob-microgrid',
      title: 'Continuous 24/7/365 Generator Duty & Single-Point Microgrid Failure',
      category: 'Power & Microgrid',
      severity: 'CRITICAL',
      stations: 'Both Maitri & Bharati',
      rootCause: 'Zero municipal grid; stations depend entirely on high-spec Arctic grade diesel generators (Kirloskar / Volvo Penta) running non-stop in extreme cold.',
      immediateImpact: 'A full microgrid blackout in polar winter causes internal station temperatures to plunge from +20°C to -15°C within 140 minutes, freezing all plumbing lines and destroying scientific instrumentation.',
      nominalTolerance: '±0.5% voltage, ±0.2 Hz frequency',
      observedPercentError: 14.2,
      peakErrorCondition: 'Frequency jitter & voltage drop error reaches 14.2% when heavy inductive loads (water trace heaters + satellite uplink amplifiers) cycle simultaneously.',
      actionPlanId: 'sop-pwr-01'
    },
    {
      id: 'prob-freshwater',
      title: 'Lake Priyadarshini 2.5m Freezing & Water Pipeline Ice-Plugging',
      category: 'Water & Life Support',
      severity: 'HIGH',
      stations: 'Maitri Only (Schirmacher)',
      rootCause: 'Maitri draws potable water via a 250m heated surface pipeline from permafrost Lake Priyadarshini. In mid-winter, surface ice reaches 2.5m depth.',
      immediateImpact: 'Failure of trace heating cables for even 45 minutes causes an irreversible solid ice plug, completely severing potable water and heating boiler feed.',
      nominalTolerance: '±0.8°C thermal line sensor margin',
      observedPercentError: 9.6,
      peakErrorCondition: 'Thermal sensor drift of 9.6% occurs due to thermocouple aging under cyclic freeze-thaw on external conduit brackets.',
      actionPlanId: 'sop-wat-02'
    },
    {
      id: 'prob-desalination',
      title: 'Seawater Intake Ice Slush & Reverse Osmosis Freezing',
      category: 'Water & Life Support',
      severity: 'HIGH',
      stations: 'Bharati Only (Larsemann)',
      rootCause: 'Bharati relies on seawater desalination (RO plant) and coastal freshwater lakes. Coastal frazil ice blocks seawater intake manifolds during tidal fluctuations.',
      immediateImpact: 'High-pressure RO membranes foul or freeze; daily freshwater generation drops from 3,500 L/day to zero, requiring rationing from emergency tanks.',
      nominalTolerance: '±2.0 bar intake pressure tolerance',
      observedPercentError: 11.8,
      peakErrorCondition: 'Pressure transmitter variance error of 11.8% caused by frazil ice slurry choking the suction differential orifice.',
      actionPlanId: 'sop-wat-02'
    },
    {
      id: 'prob-satcom',
      title: 'Low-Elevation Look Angle SATCOM Jitter & Auroral Magnetic Storms',
      category: 'Comms & Ionosphere',
      severity: 'HIGH',
      stations: 'Both Maitri & Bharati',
      rootCause: 'Antarctic stations sit at 69°-70° South, where geostationary communication satellites are at only 4° to 7° above the horizon, subject to heavy tropospheric refraction and auroral particle flux.',
      immediateImpact: 'High bit error rates (BER), packet drops, and complete telemetry silence with National Centre for Polar and Ocean Research (NCPOR) headquarters during solar flares.',
      nominalTolerance: 'Bit Error Rate < 10⁻⁷',
      observedPercentError: 24.5,
      peakErrorCondition: 'Packet loss and frame error rates surge to 24.5% during severe geomagnetic storms (Kp index > 6) and heavy drifting snow attenuation.',
      actionPlanId: 'sop-com-04'
    },
    {
      id: 'prob-logistics',
      title: '9-Month Complete Physical Isolation & Sea-Ice Vessel Impasse',
      category: 'Logistics & Isolation',
      severity: 'CRITICAL',
      stations: 'Both Maitri & Bharati',
      rootCause: 'Between March and November, winter pack ice freezes over 200 km out to sea, and polar darkness renders long-range ski-plane landings (Basler BT-67) impossible.',
      immediateImpact: 'Zero emergency evacuations, zero spare parts deliveries, zero fresh food. Any mechanical or medical failure must be handled entirely in-house.',
      nominalTolerance: '±3% fuel reserve tracking error',
      observedPercentError: 7.8,
      peakErrorCondition: 'Tank level ultrasonic sensors register 7.8% volume measurement error due to cold thermal contraction and fuel stratification inside 20,000L bulk fuel containers.',
      actionPlanId: 'sop-log-05'
    },
    {
      id: 'prob-structural-maitri',
      title: 'Aging Foundation Permafrost Shift & Creeping Thermal Loss',
      category: 'Structural & Marine',
      severity: 'HIGH',
      stations: 'Maitri Only (Schirmacher)',
      rootCause: 'Commissioned in 1989 (36+ years of operational service), Maitri was designed for a 20-year lifespan. Permafrost underneath steel pilings experiences subtle thermal shifts.',
      immediateImpact: 'Door misalignments, micro-cracks in insulation panels, accelerated heating energy loss, and structural maintenance overhead.',
      nominalTolerance: '±5mm displacement margin',
      observedPercentError: 6.4,
      peakErrorCondition: 'Permafrost tilt inclinometers demonstrate 6.4% deviation from original alignment during summer active-layer thaw cycles.',
      actionPlanId: 'sop-str-07'
    },
    {
      id: 'prob-structural-bharati',
      title: 'Coastal Salt-Spray Aerosol Corrosion & Radome Wind Shear',
      category: 'Structural & Marine',
      severity: 'HIGH',
      stations: 'Bharati Only (Larsemann)',
      rootCause: 'Bharati is perched on a coastal promontory 35m above sea level, directly exposed to ocean salt aerosols, severe wind shear, and blowing ice needles against ISRO satellite radomes.',
      immediateImpact: 'Accelerated corrosion on aluminum-composite fasteners; micro-pitting on satellite radome membranes, increasing RF attenuation.',
      nominalTolerance: 'RF Insertion Loss < 0.3 dB',
      observedPercentError: 8.9,
      peakErrorCondition: 'Radome RF transmission error increases by 8.9% when salt-ice crusting occurs during oceanic onshore storm gales.',
      actionPlanId: 'sop-str-07'
    },
    {
      id: 'prob-psychological',
      title: 'Winter-Over Syndrome, Sensory Deprivation & Acute Medical Trauma',
      category: 'Crew & Psychological',
      severity: 'HIGH',
      stations: 'Both Maitri & Bharati',
      rootCause: 'Crew of 20-25 scientists and military logistics personnel endure 4 months of 24-hour polar darkness, confined to ~1,500 m² of indoor space with no outside interaction.',
      immediateImpact: 'Disrupted circadian rhythm (Polar T3 syndrome), cognitive fatigue, sleep disorders, and risk of acute surgical trauma with only one station medical officer.',
      nominalTolerance: 'Sleep efficiency > 85%',
      observedPercentError: 16.5,
      peakErrorCondition: 'Cognitive response and task completion error rates increase by 16.5% during peak polar night (June-July) compared to summer baseline.',
      actionPlanId: 'sop-med-06'
    }
  ];

  // Comprehensive Action Plans (SOPs)
  const ACTION_PLANS: Record<string, ActionPlan> = {
    'sop-pwr-01': {
      id: 'sop-pwr-01',
      code: 'SOP-PWR-01',
      title: 'Microgrid Emergency Failover & Cold-Start Redundancy',
      triggerCondition: 'Generator output frequency drops below 48.5 Hz, phase voltage variance > 10%, or primary generator automatic shutdown.',
      errorThreshold: 'Subsystem Telemetry Error > 10% OR Generator Vibration > 6.5 mm/s',
      phase1: 'Automatic high-speed static transfer switch (STS) sheds non-critical scientific loads in < 250 milliseconds. Microgrid enters Life-Support Priority Tier 1 (heating, water freeze protection, medical).',
      phase2: 'Duty engineer activates pre-heated backup generator #2 or #3 via hydraulic air-start system. Validate oil pressure (> 3.5 bar) and synchronization with station busbar within 4 minutes.',
      phase3: 'Inspect primary generator for injector clogging, fuel line wax crystals, or bearing thermal runaway. Purge fuel filters, engage heated fuel recirculation, and log diagnostic telemetry to NCPOR Goa.',
      centralCommandRole: 'Remotely cross-verify generator telemetry via satellite link; simulate thermal decay timeline to provide real-time buffer countdown; authorize auxiliary power routing.',
      failoverRedundancy: '3x 250kVA Arctic diesel generators with N+2 redundancy at Bharati; 4x 125kVA generators at Maitri plus separate emergency shelter survival generator.',
      checklist: [
        'Confirm STS switchover to Bus B in < 300ms',
        'Verify emergency trace heating circuits are energized',
        'Check fuel tank heat tracing line temperatures (> +15°C)',
        'Check station internal living pod ambient temp (> +18°C)',
        'Transmit generator load log to NCPOR Remote Command'
      ]
    },
    'sop-wat-02': {
      id: 'sop-wat-02',
      code: 'SOP-WAT-02',
      title: 'Freshwater Lifeline De-Icing & Emergency Reservoir Protocol',
      triggerCondition: 'Priyadarshini pipeline conduit temperature drops below +3°C OR RO intake pressure differential > 3.2 bar.',
      errorThreshold: 'Thermal sensor drift > 8% OR Flow meter drop > 25% nominal',
      phase1: 'Immediately engage secondary parallel heating element on water line. Shift station potable consumption to internal 15,000L insulated buffer reservoir.',
      phase2: 'If freeze-plug is suspected, initiate localized high-frequency induction heating cycle along pipe sectors 4 and 7. Monitor back-pressure to verify plug dissolution.',
      phase3: 'At Bharati, reverse backwash seawater intake manifold using warm waste heat from generator cooling jackets (+65°C) to melt frazil ice blockage.',
      centralCommandRole: 'Monitor lake thermal stratification sensor array; model freezing velocity based on external katabatic wind chill; dispatch thermal cycling advice.',
      failoverRedundancy: '14-day indoor potable water reserve in heated internal tanks; emergency snow-melting steam coils connected to auxiliary boiler.',
      checklist: [
        'Engage auxiliary trace heating booster circuit',
        'Verify water storage tank levels (Maitri: 18kL / Bharati: 22kL)',
        'Activate culinary water rationing mode (50 L/person/day)',
        'Check heating boiler glycol loop circulation pressure',
        'Test snow-melting steam coil operational readiness'
      ]
    },
    'sop-env-03': {
      id: 'sop-env-03',
      code: 'SOP-ENV-03',
      title: 'Catastrophic Katabatic Whiteout Station Lockdown & Tether Line Protocol',
      triggerCondition: 'Sustained wind speed > 90 km/h, gusts > 120 km/h, or visibility drops below 20 meters.',
      errorThreshold: 'Anemometer error > 12% OR Visibility < 10m',
      phase1: 'SOUND STATION ALARM: Total outdoor movement prohibition (Condition 1 Lockdown). Mandatory personnel roll call via RFID badge transponders within 10 minutes.',
      phase2: 'Lock all pneumatic storm doors and secondary airlocks. Secure external crane booms, fuel transfer hoses, and vehicle engine block heaters.',
      phase3: 'If emergency outdoor transit between Maitri main building and polar huts is mandatory, crew must connect to safety steel high-tension lifeline tethers in pairs with two-way VHF transceivers.',
      centralCommandRole: 'Correlate real-time satellite infrared storm imagery with European Antarctic weather models to predict blizzard duration and wind peak hours.',
      failoverRedundancy: 'Inter-module enclosed walkways at Bharati; heavy-duty steel safety guide-ropes installed along all major paths at Maitri; GPS personal locator beacons (PLBs).',
      checklist: [
        'Complete 100% personnel head count in Command Terminal',
        'Seal all airlock outer seals and verify cabin pressurization',
        'Switch VHF emergency radios to Channel 16 Polar Watch',
        'Anchor all outdoor snowmobiles and PistenBully tracks',
        'Notify NCPOR Headquarters of Condition 1 status'
      ]
    },
    'sop-com-04': {
      id: 'sop-com-04',
      code: 'SOP-COM-04',
      title: 'Ionospheric Storm SATCOM Failover & Low-Bandwidth Mode',
      triggerCondition: 'Packet loss > 20%, Bit Error Rate > 10⁻⁴, or C-band/Ku-band satellite link unserviceable.',
      errorThreshold: 'BER Error > 15% OR Frame loss > 20%',
      phase1: 'Automatically trigger Whiteout QoS traffic shaping: throttle non-critical scientific data transfers; reserve 100% bandwidth for life-support telemetry, VoIP, and alert beacons.',
      phase2: 'Switch primary satellite uplink to secondary polar constellation (Iridium Certus low-earth orbit link) with automatic antenna elevation tracking readjustment.',
      phase3: 'If space weather blackout is total, activate High-Frequency (HF) radio link (8.9 MHz / 14.3 MHz) between Maitri and Bharati, and beam hourly telemetry packet bursts to South Africa/Goa.',
      centralCommandRole: 'NCPOR ground station maintains listener watch on auxiliary transponders; coordinates satellite beam power boost with ISRO Master Control Facility (MCF).',
      failoverRedundancy: 'Triple redundancy: Primary Geostationary C/Ku-band dish + Secondary LEO Iridium satellite dome + Tertiary HF/VHF long-range transceivers.',
      checklist: [
        'Engage Bandwidth Preservation Policy Level 2',
        'Failover to Iridium Certus secondary terminal',
        'Verify radome de-icing blower heater is active',
        'Conduct HF radio test between Maitri and Bharati',
        'Send compressed status packet to ISRO NRSC hub'
      ]
    },
    'sop-log-05': {
      id: 'sop-log-05',
      code: 'SOP-LOG-05',
      title: 'Sea-Ice Impasse & Strategic Supply Rationing Protocol',
      triggerCondition: 'Supply reserve of fuel or food drops below minimum reserve buffer (< 30 days) during active winter freeze.',
      errorThreshold: 'Fuel Gauge Sensor Error > 6% OR Consumption Variance > 15%',
      phase1: 'Initiate Fuel Conservation Tier 2: consolidate living quarters to central thermal envelope; dial back unoccupied scientific bay heating to +8°C.',
      phase2: 'Re-calibrate fuel consumption metrics using manual dipping stick to verify electronic ultrasonic gauge calibration. Audit daily food dry-store inventory.',
      phase3: 'Coordinate with Council of Managers of National Antarctic Programs (COMNAP) and Russian/Norwegian neighbor stations (Novolazarevskaya / Troll) for emergency fuel transfer if necessary.',
      centralCommandRole: 'Authorize strategic reserve drawdowns; simulate seasonal sea-ice melting timelines; arrange priority airlift slot via DROMLAN (Dronning Maud Land Air Network).',
      failoverRedundancy: 'Minimum 1.5x wintering buffer stocked each Antarctic summer season; mutual aid agreements under Antarctic Treaty Article VII.',
      checklist: [
        'Conduct manual fuel dip-stick audit across all 12 bulk tanks',
        'Engage habitat zone temperature setback (+14°C in sleep pods)',
        'Review 90-day medical antibiotics and surgical stock',
        'Brief station team on conservation schedule',
        'Transmit audited balance sheet to MoES Delhi'
      ]
    },
    'sop-med-06': {
      id: 'sop-med-06',
      code: 'SOP-MED-06',
      title: 'Winter-Over Acute Medical & Tele-Surgical Triage Protocol',
      triggerCondition: 'Severe personnel injury, hypothermia stage 2+, acute appendicitis, or psychiatric distress during zero-evacuation winter.',
      errorThreshold: 'Patient Vital Discrepancy > 10% OR Heart Rate Jitter > 15%',
      phase1: 'Station Medical Officer mobilizes station hospital suite. Stabilize patient core temperature using forced-air warming blanket; connect ECG/SpO2 telemetry.',
      phase2: 'Establish encrypted high-priority satellite telemedicine video conference with AIIMS New Delhi / Base Hospital military surgical consultants.',
      phase3: 'If surgery is mandatory, prepare station operating theater; train designated secondary expedition member as sterile surgical assistant under remote telemedicine guidance.',
      centralCommandRole: 'Maintain 24/7 dedicated low-latency telemedicine satellite channel; coordinate clinical specialist panel on continuous audio/video standby.',
      failoverRedundancy: 'Full surgical theater on site with anesthesia, oxygen concentrator, defibrillator, ultrasound, X-ray, and 12-month broad-spectrum medical payload.',
      checklist: [
        'Establish direct telemedicine link with AIIMS Polar Desk',
        'Sterilize surgical instrument pack and check autoclave',
        'Check blood group compatibility across expedition roster',
        'Confirm oxygen concentrator output purity (> 93%)',
        'Update Medical Incident Log in Command Center'
      ]
    },
    'sop-str-07': {
      id: 'sop-str-07',
      code: 'SOP-STR-07',
      title: 'Structural Envelope Degradation & Salt-Spray Mitigation Protocol',
      triggerCondition: 'Structural inclinometer tilt > 3.5°, airlock seal leakage, or composite envelope panel vibration spike.',
      errorThreshold: 'Structural Tilt Error > 5% OR Acoustic Vibration Variance > 12%',
      phase1: 'Inspect foundation anchor bolts and hydraulic leveling jacks (Bharati stilt pilings / Maitri foundation jacks). Torque loose fasteners.',
      phase2: 'Apply elastomeric silicone barrier sealants to external composite joints; check thermal insulation foam density with handheld infrared camera.',
      phase3: 'At Bharati, pressure-wash coastal salt deposits from satellite radome surfaces during weather calm (< 25 km/h wind) using heated fresh water.',
      centralCommandRole: 'Perform structural stress modeling using wind load history; schedule replacement materials for upcoming summer expedition vessel.',
      failoverRedundancy: 'Bharati aerodynamic container design deflects 85% of blizzard wind load; Maitri foundation includes secondary adjustable steel shims.',
      checklist: [
        'Perform infrared thermography scan of station outer envelope',
        'Check torque specifications on 16 foundation anchor points',
        'Verify satellite radome surface cleanliness and RF gain',
        'Inspect airlock door gaskets for cracking or hardening',
        'Log structural inspection report in Maintenance module'
      ]
    }
  };

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchStation = 
        selectedStationFilter === 'all' ? true :
        selectedStationFilter === 'maitri' ? p.stations.includes('Maitri') :
        p.stations.includes('Bharati');

      const matchCategory = 
        selectedCategoryFilter === 'all' ? true :
        p.category === selectedCategoryFilter;

      return matchStation && matchCategory;
    });
  }, [selectedStationFilter, selectedCategoryFilter]);

  const handleExecuteActionPlan = (planId: string) => {
    setExecutedPlans(prev => ({ ...prev, [planId]: true }));
    setTimeout(() => {
      setExecutedPlans(prev => ({ ...prev, [planId]: false }));
    }, 4500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* 1. TOP HERO HEADER & MISSION INTELLIGENCE BANNER */}
      {/* ======================================================== */}
      <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#060e22] via-[#040816] to-[#02040b] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider">
              <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
              <span>OFFICIAL STRATEGIC DOSSIER · NCPOR / MoES INDIA</span>
            </div>
            <h1 className="font-tech text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              MAITRI & BHARATI INTELLIGENCE MATRIX
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Strategic significance, comprehensive catalogue of all simultaneous polar vulnerabilities, 
              quantified system telemetry percent errors, and battle-tested operational response action plans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Print or Export Strategic Dossier"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>PRINT DOSSIER</span>
            </button>

            <button
              onClick={() => {
                simulateEvent('maitri-generator');
                simulateEvent('maitri-weather');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>SIMULATE DUAL CRISIS</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Chips */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            01. EXECUTIVE BRIEFING
          </button>
          <button
            onClick={() => setActiveSection('importance')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeSection === 'importance'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            02. IMPORTANCE OF MAITRI & BHARATI
          </button>
          <button
            onClick={() => setActiveSection('problems')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeSection === 'problems'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            03. ALL PROBLEMS FACED AT ONCE ({PROBLEMS.length})
          </button>
          <button
            onClick={() => setActiveSection('error-analyzer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeSection === 'error-analyzer'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            04. % ERROR & DRIFT ANALYZER
          </button>
          <button
            onClick={() => setActiveSection('action-plans')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeSection === 'action-plans'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            05. ACTION PLANS & SOPS ({Object.keys(ACTION_PLANS).length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. EXECUTIVE BRIEFING / KPI SUMMARY STATS */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'error-analyzer') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-[#060a16] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>ACTIVE POLAR BASES</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-white">2 OUTPOSTS</div>
            <div className="text-[11px] text-cyan-400 font-mono">Maitri (1989) & Bharati (2012)</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#060a16] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SIMULTANEOUS HAZARDS</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-amber-400">{PROBLEMS.length} VECTORS</div>
            <div className="text-[11px] text-slate-400 font-mono">Weather, Power, Life Support, SATCOM</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#060a16] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>AVG TELEMETRY DRIFT</span>
              <Percent className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-red-400">13.2% PEAK</div>
            <div className="text-[11px] text-slate-400 font-mono">Ultrasonic & Anemometer drift under cold</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-[#060a16] space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>MISSION-READY SOPS</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-mono-num font-bold text-emerald-400">{Object.keys(ACTION_PLANS).length} PROTOCOLS</div>
            <div className="text-[11px] text-emerald-400 font-mono">Containment in &lt; 15 mins</div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SECTION 1: STRATEGIC IMPORTANCE OF MAITRI & BHARATI */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'importance') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">STRATEGIC & GEOPOLITICAL IMPERATIVE</span>
              <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider">
                WHY MAITRI & BHARATI MATTER TO INDIA & THE WORLD
              </h2>
            </div>
            <div className="hidden sm:block text-xs font-mono text-slate-400">
              National Centre for Polar and Ocean Research (NCPOR)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* MAITRI CARD */}
            <div className="rounded-2xl border border-slate-800 bg-[#060a16] overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src="/src/assets/images/maitri_station_pod_1790348597098.jpg"
                    alt="Maitri Research Station"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] via-[#060a16]/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-[10px] font-mono text-blue-300">
                        COMMISSIONED 1989 · 36 YEARS CONTINUOUS SERVICE
                      </span>
                      <h3 className="font-tech text-2xl font-bold text-white mt-1">MAITRI RESEARCH STATION</h3>
                      <p className="text-xs font-mono text-cyan-300">Schirmacher Oasis, Queen Maud Land (70°45′57″S, 11°44′09″E)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/40 text-xs font-mono text-emerald-400 font-bold">
                      INLAND BASE
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs font-sans leading-relaxed">
                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      1. Strategic & Geopolitical Foothold
                    </h4>
                    <p className="text-slate-300">
                      Maitri is India's second Antarctic station, built after the legendary Dakshin Gangotri was buried beneath the ice sheet in 1989. 
                      Operating Maitri for over three continuous decades secured and maintains India's <strong>Consultative Status</strong> in the Antarctic Treaty System (ATS), 
                      giving the nation full decision-making veto power over Antarctic governance, mineral protections, and scientific policies.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      2. Unique Inland Ice-Free Oasis Science
                    </h4>
                    <p className="text-slate-300">
                      Situated in the ice-free rocky plateau of Schirmacher Oasis, Maitri is adjacent to <strong>Lake Priyadarshini</strong>, a pristine freshwater permafrost lake. 
                      It hosts long-term monitoring for the Indian Institute of Geomagnetism (IIG), Geological Survey of India (GSI), and National Geophysical Research Institute (NGRI).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      3. Longest Continuous Atmospheric Climate Records
                    </h4>
                    <p className="text-slate-300">
                      Over 35 years of un-interrupted records of ozone depletion dynamics, greenhouse gas fluxes, katabatic wind interactions with the polar vortex, 
                      and extreme low-frequency seismological tremors along the East Antarctic craton.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">WINTER CREW</span>
                      <span className="text-white font-bold">25 Scientists & Engineers</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">WATER SOURCE</span>
                      <span className="text-cyan-300 font-bold">Lake Priyadarshini</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">STATUS: OPERATIONAL</span>
                <button
                  onClick={() => {
                    setInspectStationId('maitri');
                    setActiveTab('stations');
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  INSPECT MAITRI CONSOLE →
                </button>
              </div>
            </div>

            {/* BHARATI CARD */}
            <div className="rounded-2xl border border-slate-800 bg-[#060a16] overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src="/src/assets/images/bharati_station_pod_1790348607568.jpg"
                    alt="Bharati Research Station"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a16] via-[#060a16]/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                        COMMISSIONED 2012 · STATE-OF-THE-ART MODULAR ARCHITECTURE
                      </span>
                      <h3 className="font-tech text-2xl font-bold text-white mt-1">BHARATI RESEARCH STATION</h3>
                      <p className="text-xs font-mono text-cyan-300">Larsemann Hills, East Antarctica (69°24′28″S, 76°11′14″E)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-cyan-950/90 border border-cyan-500/40 text-xs font-mono text-cyan-400 font-bold">
                      COASTAL HUB
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs font-sans leading-relaxed">
                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      1. National Space Backbone: ISRO Ground Station
                    </h4>
                    <p className="text-slate-300">
                      Bharati hosts the <strong>Indian Space Research Organisation (ISRO) Remote Sensing polar ground station (NRSC)</strong>. 
                      Due to its high-latitude 69°S location, Bharati sees 10 to 12 polar satellite passes every 24 hours (compared to only 2-3 from Indian territory). 
                      It captures critical real-time earth observation telemetry from Cartosat, Oceansat, and RISAT constellations and transmits it directly to Hyderabad via dedicated satellite hops.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      2. Aerodynamic Container Engineering on Stilts
                    </h4>
                    <p className="text-slate-300">
                      Constructed out of 134 prefabricated shipping container modules wrapped in an aerodynamic aluminum envelope on stilts, Bharati allows 
                      brutal 160+ km/h katabatic winds and snowdrifts to sweep directly beneath the station rather than burying it, ensuring zero structural snow burial.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider text-cyan-400 mb-1">
                      3. Southern Ocean & Paleoclimate Dynamics
                    </h4>
                    <p className="text-slate-300">
                      Direct coastal access to Prydz Bay enables physical and chemical oceanography, sea-ice mass balance tracking, benthic marine biology, 
                      and deep-ice core paleoclimate reconstruction spanning 100,000+ years.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">WINTER CREW</span>
                      <span className="text-white font-bold">23 Scientists & Engineers</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">PRIMARY POWER</span>
                      <span className="text-cyan-300 font-bold">Combined Heat & Power (CHP)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">STATUS: OPERATIONAL</span>
                <button
                  onClick={() => {
                    setInspectStationId('bharati');
                    setActiveTab('stations');
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  INSPECT BHARATI CONSOLE →
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SECTION 2: ALL PROBLEMS THEY FACE AT ONCE (MATRIX) */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'problems') && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider">ALL PROBLEMS FACED AT ONCE</span>
              <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider">
                COMPREHENSIVE POLAR VULNERABILITY MATRIX
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Every severe challenge Indian Antarctic expeditions endure concurrently, along with measured % error tolerances and root causes.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedStationFilter('all')}
                  className={`px-2.5 py-1 rounded transition-colors ${selectedStationFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  ALL BASES
                </button>
                <button
                  onClick={() => setSelectedStationFilter('maitri')}
                  className={`px-2.5 py-1 rounded transition-colors ${selectedStationFilter === 'maitri' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  MAITRI
                </button>
                <button
                  onClick={() => setSelectedStationFilter('bharati')}
                  className={`px-2.5 py-1 rounded transition-colors ${selectedStationFilter === 'bharati' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  BHARATI
                </button>
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Threat Categories</option>
                <option value="Weather & Climate">Weather & Climate</option>
                <option value="Power & Microgrid">Power & Microgrid</option>
                <option value="Water & Life Support">Water & Life Support</option>
                <option value="Logistics & Isolation">Logistics & Isolation</option>
                <option value="Comms & Ionosphere">Comms & Ionosphere</option>
                <option value="Structural & Marine">Structural & Marine</option>
                <option value="Crew & Psychological">Crew & Psychological</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProblems.map((prob) => {
              const plan = ACTION_PLANS[prob.actionPlanId];
              return (
                <div
                  key={prob.id}
                  className="rounded-xl border border-slate-800 bg-[#060a16] p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                        {prob.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        prob.severity === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border border-red-500/40' :
                        prob.severity === 'HIGH' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40' :
                        'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                      }`}>
                        {prob.severity}
                      </span>
                    </div>

                    <h3 className="font-tech text-base font-bold text-white leading-snug">
                      {prob.title}
                    </h3>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {prob.rootCause}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-slate-400">
                        <span>AFFECTED:</span>
                        <span className="text-white font-medium">{prob.stations}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>NOMINAL TOLERANCE:</span>
                        <span className="text-slate-300">{prob.nominalTolerance}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                        <span className="text-amber-400 font-bold">PEAK TELEMETRY ERROR:</span>
                        <span className="text-red-400 font-bold font-mono-num text-xs">
                          {prob.observedPercentError}% ERROR
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      <strong className="text-slate-300 not-italic">Error Condition: </strong>
                      {prob.peakErrorCondition}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveActionPlanId(prob.actionPlanId);
                        setActiveSection('action-plans');
                      }}
                      className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
                    >
                      <span>VIEW ACTION PLAN ({plan?.code})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleExecuteActionPlan(prob.actionPlanId)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        executedPlans[prob.actionPlanId]
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {executedPlans[prob.actionPlanId] ? 'ACTIVATED ✓' : 'TEST SOP'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SECTION 3: % ERROR & DRIFT ANALYZER (QUANTIFIABLE) */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'error-analyzer') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">QUANTIFIABLE TELEMETRY DRIFT & UNCERTAINTY</span>
              <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider">
                SYSTEM TELEMETRY % ERROR & RELIABILITY SIMULATOR
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              POLAR ENVIRONMENTAL STRESS TEST
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Interactive Environmental Stress Sliders */}
            <div className="lg:col-span-5 rounded-2xl border border-cyan-500/30 bg-[#060a16] p-6 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                  <Sliders className="w-4 h-4" />
                  <span className="font-bold uppercase tracking-wider">DYNAMIC POLAR STRESS CONTROLS</span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Adjust simulated polar environmental variables to observe how sensor telemetry error rates and subsystem failure probability compound under extreme cold.
                </p>
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    KATABATIC WIND SPEED
                  </span>
                  <span className="text-cyan-300 font-bold font-mono-num">{simWindSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  step="5"
                  value={simWindSpeed}
                  onChange={(e) => setSimWindSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>20 km/h (Calm)</span>
                  <span>90 km/h (Blizzard)</span>
                  <span>160 km/h (Extreme)</span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-400" />
                    AMBIENT TEMPERATURE
                  </span>
                  <span className="text-blue-300 font-bold font-mono-num">{simTemperature}°C</span>
                </div>
                <input
                  type="range"
                  min="-55"
                  max="-5"
                  step="1"
                  value={simTemperature}
                  onChange={(e) => setSimTemperature(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>-55°C (Polar Deep Freeze)</span>
                  <span>-30°C</span>
                  <span>-5°C (Summer)</span>
                </div>
              </div>

              {/* Days in Isolation Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    CONSECUTIVE DAYS IN ISOLATION
                  </span>
                  <span className="text-amber-300 font-bold font-mono-num">{simDaysIsolated} Days</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="270"
                  step="5"
                  value={simDaysIsolated}
                  onChange={(e) => setSimDaysIsolated(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>10d (Arrival)</span>
                  <span>140d (Mid-Winter)</span>
                  <span>270d (Late Winter)</span>
                </div>
              </div>

              {/* Real-Time Calculated Compound Metrics */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-slate-400 font-bold uppercase">
                  SIMULATED STRESS OUTPUT
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Composite Telemetry % Error:</span>
                  <span className={`text-xl font-mono-num font-bold ${
                    dynamicTelemetryError > 20 ? 'text-red-400' :
                    dynamicTelemetryError > 12 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {dynamicTelemetryError}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Microgrid Blackout Probability:</span>
                  <span className={`text-xl font-mono-num font-bold ${
                    dynamicFailureProbability > 50 ? 'text-red-400' :
                    dynamicFailureProbability > 25 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {dynamicFailureProbability}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      dynamicFailureProbability > 50 ? 'bg-red-500' :
                      dynamicFailureProbability > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${dynamicFailureProbability}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Comparative Subsystem % Error Breakdown Table */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#060a16] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
                  TELEMETRY SENSOR ACCURACY & ERROR RATE BENCHMARKS
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">MAITRI VS BHARATI</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2.5 font-semibold">Subsystem / Telemetry Channel</th>
                      <th className="py-2.5 font-semibold">Nominal Spec</th>
                      <th className="py-2.5 font-semibold">Blizzard % Error</th>
                      <th className="py-2.5 font-semibold">Maitri vs Bharati</th>
                      <th className="py-2.5 font-semibold">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        Ultrasonic Anemometer Wind Speed
                      </td>
                      <td className="py-3 text-slate-400">±2.0 km/h</td>
                      <td className="py-3 text-red-400 font-bold font-mono-num">18.4% Error</td>
                      <td className="py-3 text-slate-400">Equal exposure</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-500/30">
                          CRITICAL
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Microgrid Voltage & Frequency
                      </td>
                      <td className="py-3 text-slate-400">±0.2 Hz</td>
                      <td className="py-3 text-red-400 font-bold font-mono-num">14.2% Variance</td>
                      <td className="py-3 text-slate-400">Maitri higher drift</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-500/30">
                          CRITICAL
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                        SATCOM Uplink Bit Error Rate (BER)
                      </td>
                      <td className="py-3 text-slate-400">&lt; 10⁻⁷</td>
                      <td className="py-3 text-red-400 font-bold font-mono-num">24.5% Loss</td>
                      <td className="py-3 text-slate-400">Bharati better tracking</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-500/30">
                          HIGH
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        Freshwater Pipeline Trace Heating
                      </td>
                      <td className="py-3 text-slate-400">±0.8°C</td>
                      <td className="py-3 text-amber-400 font-bold font-mono-num">9.6% Drift</td>
                      <td className="py-3 text-slate-400">Maitri (Priyadarshini)</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-500/30">
                          HIGH
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        Bulk Fuel Tank Ultrasonic Level
                      </td>
                      <td className="py-3 text-slate-400">±1.0%</td>
                      <td className="py-3 text-amber-400 font-bold font-mono-num">7.8% Stratification</td>
                      <td className="py-3 text-slate-400">Equal cold volume error</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30">
                          ELEVATED
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-medium text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        Permafrost Stilt Inclinometer
                      </td>
                      <td className="py-3 text-slate-400">±0.1°</td>
                      <td className="py-3 text-emerald-400 font-bold font-mono-num">6.4% Deviation</td>
                      <td className="py-3 text-slate-400">Maitri 36-yr pilings</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30">
                          ELEVATED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Telemetry Drift Correction Rule:</strong> When external wind exceeds 80 km/h or temperature drops below -35°C, 
                  Whiteout Command Center applies automatic low-pass statistical Kalman filters to eliminate acoustic jitter and thermal thermocouple drift.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SECTION 4: COMPREHENSIVE ACTION PLANS & SOPS */}
      {/* ======================================================== */}
      {(activeSection === 'overview' || activeSection === 'action-plans') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">STANDARD OPERATING PROCEDURES (SOPS)</span>
              <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider">
                COMPREHENSIVE CRISIS ACTION PLANS
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              CENTRAL COMMAND PROTOCOL SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Nav: SOP Selector */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">SELECT CRISIS SOP:</span>
              {Object.values(ACTION_PLANS).map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setActiveActionPlanId(plan.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeActionPlanId === plan.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                      : 'bg-[#060a16] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-cyan-400 font-bold">{plan.code}</span>
                    <span className="text-[10px] text-slate-400">CONTAINMENT &lt; 15M</span>
                  </div>
                  <div className="font-tech font-bold text-sm leading-tight text-white mb-1">
                    {plan.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    Trigger: {plan.triggerCondition}
                  </div>
                </button>
              ))}
            </div>

            {/* Right Display: Detailed Active Action Plan */}
            {(() => {
              const plan = ACTION_PLANS[activeActionPlanId];
              if (!plan) return null;

              return (
                <div className="lg:col-span-8 rounded-2xl border border-cyan-500/40 bg-[#060a16] p-6 space-y-6">
                  
                  {/* SOP Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300">
                          {plan.code}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VALIDATED NCPOR PROTOCOL
                        </span>
                      </div>
                      <h3 className="font-tech text-2xl font-bold text-white mt-1.5">
                        {plan.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleExecuteActionPlan(plan.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-tech font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        executedPlans[plan.id]
                          ? 'bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                          : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{executedPlans[plan.id] ? 'SOP ACTIVATED IN CONSOLE' : 'EXECUTE ACTION PLAN'}</span>
                    </button>
                  </div>

                  {/* Trigger & Error Threshold Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block uppercase">TRIGGER CONDITION</span>
                      <span className="text-amber-300 font-medium">{plan.triggerCondition}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px] block uppercase">MEASURED % ERROR TOLERANCE</span>
                      <span className="text-red-400 font-medium">{plan.errorThreshold}</span>
                    </div>
                  </div>

                  {/* 3-Phase Action Timeline */}
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">RESPONSE TIMELINE & ACTIONS:</span>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                      
                      {/* Phase 1 */}
                      <div className="relative space-y-1">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-[#060a16]" />
                        <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                          PHASE 1: 0 - 15 MINUTES (IMMEDIATE CREW CONTAINMENT)
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          {plan.phase1}
                        </p>
                      </div>

                      {/* Phase 2 */}
                      <div className="relative space-y-1">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#060a16]" />
                        <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                          PHASE 2: 15 - 60 MINUTES (TECHNICAL STABILIZATION)
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          {plan.phase2}
                        </p>
                      </div>

                      {/* Phase 3 */}
                      <div className="relative space-y-1">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#060a16]" />
                        <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          PHASE 3: 1 - 4 HOURS (SYSTEM NORMALIZATION & LOGGING)
                        </div>
                        <p className="text-xs font-sans text-slate-300 leading-relaxed">
                          {plan.phase3}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Central Command Role & Redundancy Backup */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-cyan-400 font-tech font-bold uppercase text-xs">
                        NCPOR HQ Central Command Role
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {plan.centralCommandRole}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-emerald-400 font-tech font-bold uppercase text-xs">
                        Engineered Redundancy Buffer
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {plan.failoverRedundancy}
                      </p>
                    </div>
                  </div>

                  {/* SOP Execution Checklist */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      OPERATIONAL VERIFICATION CHECKLIST:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {plan.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};
