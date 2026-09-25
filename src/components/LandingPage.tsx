import React, { useEffect, useRef, useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Snowflake, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Boxes, 
  ThermometerSnowflake, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film, 
  Sparkles, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Sliders, 
  Check, 
  Compass, 
  Wind, 
  Clock, 
  ChevronRight,
  Info,
  FileText,
  ClipboardList
} from 'lucide-react';
import { useStation } from '../context/StationContext';

// Verified, reliable high-definition Antarctic video streams (HTTP 200 with Accept-Ranges)
export interface PolarVideo {
  id: string;
  title: string;
  tag: string;
  location: string;
  sourceType: string;
  duration: string;
  videoUrl: string;
  fallbackPoster: string;
  description: string;
}

const CINEMATIC_VIDEOS: PolarVideo[] = [
  {
    id: 'drone-glaciers',
    title: 'Glacial Ice Shelf & Outpost Drone Flight',
    tag: '720p HD · Aerial Drone',
    location: 'Antarctic Peninsula & Coastal Ice Shelf',
    sourceType: 'Expedition Drone Telemetry',
    duration: '03:14 Reel',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/4d/ANTARCTICA_2015_BG_Expedition_-_Drone_Footage.webm/ANTARCTICA_2015_BG_Expedition_-_Drone_Footage.webm.720p.vp9.webm',
    fallbackPoster: '/src/assets/images/antarctica_iceberg_drift_1790349233741.jpg',
    description: 'High-altitude drone flight over jagged blue ice crevasses, tabular bergs, and remote expedition outposts.'
  },
  {
    id: 'polar-night-timelapse',
    title: 'Adelaide Island Polar Night & Starlight',
    tag: '1080p HD · Time-Lapse',
    location: 'Rothera Point, Adelaide Island',
    sourceType: 'Astronomical Long Exposure',
    duration: '00:26 Loop',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/39/Time-lapse_of_night_sky_in_Antarctica.webm/Time-lapse_of_night_sky_in_Antarctica.webm.1080p.vp9.webm',
    fallbackPoster: '/src/assets/images/antarctica_aurora_cinematic_1790349220391.jpg',
    description: 'Crisp Antarctic winter night sky time-lapse showing southern celestial rotation above research domes.'
  },
  {
    id: 'satellite-packice',
    title: 'Southern Ocean Sea Ice Break-Up',
    tag: '480p · Satellite Feed',
    location: 'Circumpolar Southern Ocean',
    sourceType: 'NOAA / CIRA Polar Satellite',
    duration: '00:18 Loop',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/66/Ice_Breaking_Up_Near_Antarctica_%28CIRA_2023-11-06_-_nolabels%29.webm/Ice_Breaking_Up_Near_Antarctica_%28CIRA_2023-11-06_-_nolabels%29.webm.480p.vp9.webm',
    fallbackPoster: '/src/assets/images/antarctica_sat_curr_1790348584669.jpg',
    description: 'Satellite remote sensing animation capturing massive seasonal ice pack rift formation near Indian supply corridors.'
  },
  {
    id: 'mesospheric-clouds',
    title: 'Noctilucent Polar Cloud Waves',
    tag: '480p · Atmospheric Scan',
    location: 'Upper Stratosphere, Continental Antarctica',
    sourceType: 'CIRA Mesospheric Imager',
    duration: '00:22 Loop',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/7/75/Noctilucent_Clouds_Dance_Over_Antarctica_%28CIRA_2025-01-27_-_nolabels%29.webm/Noctilucent_Clouds_Dance_Over_Antarctica_%28CIRA_2025-01-27_-_nolabels%29.webm.480p.vp9.webm',
    fallbackPoster: '/src/assets/images/hero_antarctica_station_1790348556983.jpg',
    description: 'Rare polar noctilucent mesospheric ice crystals forming undulating gravity waves across high latitudes.'
  }
];

export const LandingPage: React.FC = () => {
  const { enterCommandCenter, stations, setInspectStationId, setActiveTab } = useStation();
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theaterVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const windGainRef = useRef<GainNode | null>(null);

  const [activeVideoIdx, setActiveVideoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [videoOpacity, setVideoOpacity] = useState<number>(0.45); // 0.25 | 0.45 | 0.70
  const [isVideoVisible, setIsVideoVisible] = useState<boolean>(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const currentVideo = CINEMATIC_VIDEOS[activeVideoIdx];

  // Drifting Snow Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      density: Math.random() * 0.7 + 0.2,
      opacity: Math.random() * 0.45 + 0.15,
      drift: (Math.random() - 0.5) * 0.4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Polar concentric range rings centered on Antarctica
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      const centerX = width * 0.72;
      const centerY = height * 0.42;

      [180, 320, 480, 640].forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Update particle physics
      particles.forEach(p => {
        ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.density * 0.55;
        p.x += p.drift + 0.12;

        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        else if (p.x < 0) p.x = width;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Web Audio API Ambient Polar Wind Generator
  const toggleAmbientWind = () => {
    if (!isAudioEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioContextRef.current || new AudioCtx();
        audioContextRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Pink/Brown noise generator for polar wind
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for deep Antarctic wind howling
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        // Low-frequency oscillator to create wind gust swells
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(120, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        windGainRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        lfo.start();
        setIsAudioEnabled(true);
      } catch {
        setIsAudioEnabled(false);
      }
    } else {
      if (windGainRef.current && audioContextRef.current) {
        windGainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      setIsAudioEnabled(false);
    }
  };

  // Video play/pause toggle
  const togglePlay = () => {
    const target = isTheaterOpen ? theaterVideoRef.current : videoRef.current;
    if (!target) return;
    if (isPlaying) {
      target.pause();
      setIsPlaying(false);
    } else {
      target.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSceneSelect = (idx: number) => {
    setActiveVideoIdx(idx);
    setVideoError(false);
    setIsPlaying(true);
  };

  const scrollToExplore = () => {
    const el = document.getElementById('explore-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenStationDirect = (id: 'maitri' | 'bharati') => {
    setInspectStationId(id);
    enterCommandCenter();
    setActiveTab('stations');
  };

  return (
    <div className="relative min-h-screen bg-[#03060e] text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 font-sans">
      
      {/* ======================================================== */}
      {/* 1. CINEMATIC BACKGROUND VIDEO LAYER */}
      {/* ======================================================== */}
      {isVideoVisible && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700">
          <video
            ref={videoRef}
            key={currentVideo.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={currentVideo.fallbackPoster}
            onTimeUpdate={(e) => {
              setVideoTime(e.currentTarget.currentTime);
              setVideoDuration(e.currentTarget.duration || 0);
            }}
            onError={() => setVideoError(true)}
            style={{ opacity: videoOpacity }}
            className="w-full h-full object-cover filter brightness-90 contrast-105 scale-[1.03] transition-opacity duration-1000"
          >
            <source src={currentVideo.videoUrl} type="video/webm" />
            <source src={currentVideo.videoUrl} type="video/mp4" />
          </video>

          {/* Fallback image backdrop */}
          {videoError && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-700" 
              style={{ backgroundImage: `url(${currentVideo.fallbackPoster})` }}
            />
          )}
        </div>
      )}

      {/* Atmospheric lighting gradients & dark polar vignettes */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_95%_75%_at_50%_0%,rgba(14,116,144,0.24),rgba(3,6,14,0.92))]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-t from-[#03060e] via-[#03060e]/80 to-transparent" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(3,6,14,0.94)_0%,rgba(3,6,14,0.55)_50%,rgba(3,6,14,0.94)_100%)]" />

      {/* Snow Particles Canvas */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
      />

      {/* ======================================================== */}
      {/* 2. TOP BAR & QUICK CINEMATIC CONTROLS */}
      {/* ======================================================== */}
      <header className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-md">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Snowflake className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-tech text-xl sm:text-2xl font-bold tracking-widest text-slate-50 uppercase">
              WHITEOUT
            </span>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              Indian Antarctic Remote Operations
            </span>
          </div>
        </div>

        {/* Video Mode Bar & Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* Ambient Polar Sound Button */}
          <button
            onClick={toggleAmbientWind}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              isAudioEnabled 
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle synthesized ambient polar wind howling sound"
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>POLAR AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>POLAR AUDIO</span>
              </>
            )}
          </button>

          {/* Strategic Dossier & Action Plans Button */}
          <button
            onClick={() => {
              enterCommandCenter();
              setActiveTab('strategic-dossier');
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer"
            title="Strategic Importance of Maitri & Bharati, All Problems & Action Plans"
          >
            <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
            <span>MAITRI & BHARATI DOSSIER</span>
          </button>

          {/* Theater View Launcher */}
          <button
            onClick={() => setIsTheaterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-cyan-300 hover:text-white transition-colors cursor-pointer"
            title="Expand to Fullscreen Theater Mode"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">CINEMATIC THEATER</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={enterCommandCenter}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all duration-200 shadow-[0_0_25px_rgba(34,211,238,0.35)] cursor-pointer"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 3. HERO SECTION WITH VIDEO REEL SELECTOR */}
      {/* ======================================================== */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-20 md:pt-10 md:pb-24">
        
        {/* Cinematic Video Scene Bar - EASY TO SWITCH & DISCOVER */}
        <div className="mb-6 p-2 rounded-xl bg-slate-950/85 border border-cyan-500/20 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-2 text-xs font-mono text-cyan-400">
            <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase">POLAR REEL:</span>
          </div>

          {/* 4 Interactive Video Chips */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-[300px]">
            {CINEMATIC_VIDEOS.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => handleSceneSelect(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeVideoIdx === idx
                    ? 'bg-cyan-500/25 text-white font-semibold border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeVideoIdx === idx ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                <span className="truncate max-w-[150px] sm:max-w-[190px]">{vid.title}</span>
              </button>
            ))}
          </div>

          {/* Video Control Buttons: Pause/Play, Opacity & Expand */}
          <div className="flex items-center gap-2 px-2 border-l border-slate-800">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause background video' : 'Resume background video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Opacity Presets */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span className="text-[10px] text-slate-500 mr-1">TINT:</span>
              <button
                onClick={() => setVideoOpacity(0.25)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${videoOpacity === 0.25 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                25%
              </button>
              <button
                onClick={() => setVideoOpacity(0.45)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${videoOpacity === 0.45 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                45%
              </button>
              <button
                onClick={() => setVideoOpacity(0.70)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${videoOpacity === 0.70 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                70%
              </button>
            </div>

            {/* Theater Mode Button */}
            <button
              onClick={() => setIsTheaterOpen(true)}
              className="p-1.5 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-colors cursor-pointer"
              title="Watch in Theater Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Hero Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Branding, Mission Statement & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Live Operations Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 text-xs font-mono tracking-wider backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>CENTRAL REMOTE COMMAND PLATFORM · MAITRI & BHARATI</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="font-tech text-6xl md:text-8xl font-bold tracking-tight text-white leading-none">
                WHITEOUT
              </h1>
              <p className="text-xl sm:text-2xl font-tech text-cyan-200/90 font-medium tracking-wide">
                Remote Intelligence for Antarctic Operations
              </p>
              <p className="text-sm sm:text-base text-cyan-400 font-mono tracking-widest uppercase">
                “Monitor. Predict. Respond.”
              </p>
            </div>

            {/* Supporting Pitch */}
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              A unified digital command platform for safer and more efficient remote management 
              of Indian Antarctic research stations. Monitor station conditions, wintering personnel, power microgrids, 
              critical supplies, weather extremes, and predictive equipment maintenance from one unified terminal.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={enterCommandCenter}
                className="group flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all duration-200 shadow-[0_0_30px_rgba(34,211,238,0.4)] cursor-pointer"
              >
                <span>ENTER COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToExplore}
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium tracking-wide text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 rounded-lg transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>EXPLORE PLATFORM</span>
              </button>
            </div>

            {/* 1-Click Station Quick Access Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="text-slate-500 uppercase">DIRECT STATION JUMP:</span>
              <button
                onClick={() => handleOpenStationDirect('maitri')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer group"
              >
                <span>🇮🇳 MAITRI</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  SCORE {stations.maitri.whiteoutScore}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
              
              <button
                onClick={() => handleOpenStationDirect('bharati')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer group"
              >
                <span>🇮🇳 BHARATI</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  SCORE {stations.bharati.whiteoutScore}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  enterCommandCenter();
                  setActiveTab('strategic-dossier');
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 hover:text-white transition-colors cursor-pointer group"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>ALL PROBLEMS & ACTION PLANS</span>
                <ChevronRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Cinematic Video Feed Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800/90 bg-[#060a16]/85 p-5 sm:p-6 backdrop-blur-xl shadow-2xl overflow-hidden space-y-4">
              
              {/* Header with active scene badge */}
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold uppercase tracking-wider">ACTIVE CINEMATIC STREAM</span>
                </div>
                <span className="text-cyan-300 text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {currentVideo.tag}
                </span>
              </div>

              {/* Station Video/Image Interactive Preview Box */}
              <div 
                onClick={() => setIsTheaterOpen(true)}
                className="relative h-56 w-full rounded-xl overflow-hidden border border-cyan-500/30 group cursor-pointer"
              >
                {/* Visual backdrop */}
                <img
                  src={currentVideo.fallbackPoster}
                  alt={currentVideo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Center Play / Theater button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/80 group-hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.6)] group-hover:scale-110">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Top status tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/80 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 backdrop-blur-sm">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>{currentVideo.location}</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                  <Maximize2 className="w-3 h-3 text-cyan-400" />
                  <span>THEATER</span>
                </div>

                {/* Bottom Video Metadata */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-cyan-400">{currentVideo.sourceType}</p>
                    <p className="text-sm font-tech font-bold text-white drop-shadow-md">{currentVideo.title}</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Station Quick Telemetry Split Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => handleOpenStationDirect('maitri')}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">MAITRI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-2xl font-mono-num font-bold text-white">{stations.maitri.whiteoutScore}</div>
                  <div className="text-[10px] font-mono text-cyan-300/80 uppercase">WHITEOUT SCORE</div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>PWR: {stations.maitri.powerPercentage}%</span>
                    <span>TEMP: {stations.maitri.weather.temperatureC}°C</span>
                  </div>
                </div>

                <div 
                  onClick={() => handleOpenStationDirect('bharati')}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">BHARATI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-2xl font-mono-num font-bold text-white">{stations.bharati.whiteoutScore}</div>
                  <div className="text-[10px] font-mono text-cyan-300/80 uppercase">WHITEOUT SCORE</div>
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>PWR: {stations.bharati.powerPercentage}%</span>
                    <span>TEMP: {stations.bharati.weather.temperatureC}°C</span>
                  </div>
                </div>
              </div>

              {/* Priority Attention Preview Banner */}
              <div 
                onClick={enterCommandCenter}
                className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs cursor-pointer hover:bg-amber-950/30 transition-colors"
              >
                <div className="flex items-center justify-between text-amber-400 font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>WHAT NEEDS ATTENTION?</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-0.5">
                    VIEW <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  Generator #2 at Maitri operating at 1,284h with vibration variance. Maintenance due in 3 days.
                </p>
              </div>

              {/* Launch Command Center Button */}
              <button
                onClick={enterCommandCenter}
                className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>OPEN OPERATIONAL DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. PLATFORM EXPLORATION & CAPABILITY SHOWCASE */}
        {/* ======================================================== */}
        <section id="explore-section" className="mt-24 pt-16 border-t border-slate-800/80">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider">
              OPERATIONAL WORKFLOW: MONITOR → DETECT → PRIORITIZE → RESPOND
            </span>
            <h2 className="font-tech text-3xl md:text-5xl font-bold text-white tracking-tight mt-3">
              One Digital Command Center. Two Indian Stations. One Unified View.
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed">
              WHITEOUT gives the central operations team a single digital window into what is happening 
              at remote Antarctic research stations — and automatically highlights what needs attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={enterCommandCenter}
              className="p-5 rounded-xl border border-slate-800/90 bg-[#060a16]/80 hover:border-cyan-500/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-lg font-semibold text-white mb-2">Priority Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically organizes issues by severity (Critical, High, Monitor, Normal) so the central team knows what needs attention within 5 seconds.
              </p>
            </div>

            <div 
              onClick={enterCommandCenter}
              className="p-5 rounded-xl border border-slate-800/90 bg-[#060a16]/80 hover:border-cyan-500/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-lg font-semibold text-white mb-2">Days Remaining Logistics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Answers “How long will supplies last?” for fuel, food, and medical stock with minimum reserve thresholds and simulated airlift workflows.
              </p>
            </div>

            <div 
              onClick={enterCommandCenter}
              className="p-5 rounded-xl border border-slate-800/90 bg-[#060a16]/80 hover:border-cyan-500/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-lg font-semibold text-white mb-2">Predictive Maintenance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates heavy cycle operating hours and vibration telemetry to advise maintenance before generators or heating loops fail in polar cold.
              </p>
            </div>

            <div 
              onClick={enterCommandCenter}
              className="p-5 rounded-xl border border-slate-800/90 bg-[#060a16]/80 hover:border-cyan-500/40 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <ThermometerSnowflake className="w-5 h-5" />
              </div>
              <h3 className="font-tech text-lg font-semibold text-white mb-2">Environmental Remote Sensing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive Antarctic map with weather layers, katabatic wind tracking, and a Before/After satellite comparison slider for regional sea ice.
              </p>
            </div>
          </div>

          {/* Featured Strategic Dossier Banner */}
          <div 
            onClick={() => {
              enterCommandCenter();
              setActiveTab('strategic-dossier');
            }}
            className="mt-8 p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 hover:border-cyan-400 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 font-bold border border-cyan-500/30">
                    SPECIAL INTELLIGENCE DOSSIER
                  </span>
                  <span className="text-xs font-mono text-emerald-400">9 Core Polar Vulnerabilities Cataloged</span>
                </div>
                <h3 className="font-tech text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Importance of Maitri & Bharati: All Problems Faced At Once, % Error Metrics & Action Plans
                </h3>
                <p className="text-xs text-slate-300 font-sans max-w-3xl">
                  Deep-dive operational briefing covering India's Antarctic treaty legacy, ISRO polar ground station role, simultaneous microgrid/katabatic/water hazards, telemetry error drift calculator, and step-by-step SOP containment protocols.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 group-hover:bg-cyan-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0">
              <span>EXPLORE DOSSIER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={enterCommandCenter}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-[0_0_25px_rgba(34,211,238,0.35)] cursor-pointer"
            >
              <span>Launch Whiteout Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 5. CINEMATIC THEATER OVERLAY (EASY FULLSCREEN VIDEO EXPERIENCE) */}
      {/* ======================================================== */}
      {isTheaterOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-2xl animate-in fade-in duration-300">
          
          {/* Top Bar inside Theater */}
          <div className="w-full max-w-6xl flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-tech text-lg font-bold text-white tracking-wide">{currentVideo.title}</h3>
                <p className="text-xs font-mono text-cyan-400">{currentVideo.location} · {currentVideo.tag}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleAmbientWind}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAudioEnabled 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isAudioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
              </button>

              <button
                onClick={() => setIsTheaterOpen(false)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Video Viewport */}
          <div className="relative w-full max-w-6xl h-[65vh] rounded-2xl overflow-hidden border border-cyan-500/30 bg-black shadow-2xl my-auto">
            <video
              ref={theaterVideoRef}
              key={`theater-${currentVideo.videoUrl}`}
              autoPlay
              loop
              controls
              playsInline
              poster={currentVideo.fallbackPoster}
              className="w-full h-full object-contain"
            >
              <source src={currentVideo.videoUrl} type="video/webm" />
              <source src={currentVideo.videoUrl} type="video/mp4" />
            </video>

            {/* Overlaid Mission Watermark */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-slate-700 text-[11px] font-mono text-slate-300 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>ISRO-NCPOR TELEMETRY · REEL 0{activeVideoIdx + 1}</span>
            </div>
          </div>

          {/* Bottom Scene Quick Switcher in Theater Mode */}
          <div className="w-full max-w-6xl pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {CINEMATIC_VIDEOS.map((vid, idx) => (
                <button
                  key={`thumb-${vid.id}`}
                  onClick={() => handleSceneSelect(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    activeVideoIdx === idx
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  0{idx + 1}. {vid.title.split(' ')[0]} {vid.title.split(' ')[1]}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsTheaterOpen(false);
                enterCommandCenter();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              <span>PROCEED TO COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. BOTTOM STATUS BAR */}
      {/* ======================================================== */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/90 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              DATA STREAM ACTIVE
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              ANTARCTIC OPERATIONS MONITORING
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            NCPOR / Ministry of Earth Sciences · Software MVP (Demo Data Mode)
          </div>
        </div>
      </footer>
    </div>
  );
};
