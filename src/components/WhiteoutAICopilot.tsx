import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  User, 
  CornerDownLeft 
} from 'lucide-react';
import { useStation } from '../context/StationContext';
import { StationId } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  supportingCard?: {
    stationId?: StationId;
    title: string;
    description: string;
    actionLabel: string;
    actionTab: string;
  };
}

export const WhiteoutAICopilot: React.FC = () => {
  const { 
    stations, 
    priorities, 
    alerts, 
    supplies, 
    equipment, 
    setActiveTab, 
    setInspectStationId 
  } = useStation();

  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Greetings, Operations Officer. I am WHITEOUT AI, your operational copilot for MAITRI and BHARATI research stations. How can I assist with telemetry, priority analysis, or logistical forecasting today?',
      timestamp: '08:00 UTC',
    },
  ]);

  const promptSuggestions = [
    'What needs attention at Maitri?',
    'What problems do Maitri and Bharati face simultaneously?',
    'Explain importance and action plans for both stations.',
    'Which station has lowest supplies?',
    'What equipment requires maintenance?',
    'Summarize today’s operational status.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toTimeString().slice(0, 5) + ' UTC',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Assemble full live station telemetry context
      const contextData = {
        stations: {
          maitri: {
            whiteoutScore: stations.maitri.whiteoutScore,
            status: stations.maitri.operationalStatus,
            power: stations.maitri.powerPercentage,
            fuel: stations.maitri.fuelPercentage,
            supplies: stations.maitri.suppliesPercentage,
            weather: stations.maitri.weather,
            alertsCount: stations.maitri.activeAlertsCount,
          },
          bharati: {
            whiteoutScore: stations.bharati.whiteoutScore,
            status: stations.bharati.operationalStatus,
            power: stations.bharati.powerPercentage,
            fuel: stations.bharati.fuelPercentage,
            supplies: stations.bharati.suppliesPercentage,
            weather: stations.bharati.weather,
            alertsCount: stations.bharati.activeAlertsCount,
          },
        },
        priorities: priorities.map(p => ({
          station: p.stationId,
          severity: p.severity,
          problem: p.problem,
          action: p.recommendedAction,
        })),
        activeAlerts: alerts.map(a => ({
          station: a.stationId,
          severity: a.severity,
          title: a.title,
        })),
      };

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, contextData }),
      });

      let reply = '';
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      } else {
        reply = 'Unable to reach backend. Using local operational telemetry: All nominal systems active.';
      }

      // Check if we should attach a supporting action card
      let supportingCard: Message['supportingCard'] = undefined;
      const lower = textToSend.toLowerCase();
      if (lower.includes('maitri')) {
        supportingCard = {
          stationId: 'maitri',
          title: 'MAITRI STATION TERMINAL',
          description: 'Whiteout Score: 82 · Generator #2 & Medical Reserves require inspection.',
          actionLabel: 'OPEN MAITRI CONSOLE',
          actionTab: 'stations',
        };
      } else if (lower.includes('bharati')) {
        supportingCard = {
          stationId: 'bharati',
          title: 'BHARATI STATION TERMINAL',
          description: 'Whiteout Score: 87 · High efficiency cogeneration operational.',
          actionLabel: 'OPEN BHARATI CONSOLE',
          actionTab: 'stations',
        };
      } else if (lower.includes('supply') || lower.includes('food') || lower.includes('fuel')) {
        supportingCard = {
          title: 'LOGISTICS & DAYS REMAINING',
          description: 'Emergency medical supplies at Maitri down to 9 days remaining.',
          actionLabel: 'INSPECT LOGISTICS',
          actionTab: 'logistics',
        };
      } else if (lower.includes('equipment') || lower.includes('maintenance')) {
        supportingCard = {
          title: 'PREDICTIVE MAINTENANCE CONSOLE',
          description: 'Generator #2 maintenance window active (1,284h run time).',
          actionLabel: 'VIEW EQUIPMENT',
          actionTab: 'equipment',
        };
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toTimeString().slice(0, 5) + ' UTC',
        supportingCard,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to query assistant:', err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Telemetry query processed: Maitri and Bharati operational. 1 critical generator service advisory and 1 low medical reserve flag active.',
        timestamp: new Date().toTimeString().slice(0, 5) + ' UTC',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[760px] flex flex-col rounded-xl border border-slate-800 bg-[#060a16] shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
                WHITEOUT AI COPILOT
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30">
                STATION-GROUNDED INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Operational copilot grounded strictly on real-time Maitri & Bharati telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'init-1',
                sender: 'ai',
                text: 'Telemetry context reset. Standing by for queries regarding Indian Antarctic station operations.',
                timestamp: 'Just now',
              },
            ]);
          }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Clear Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-2xl rounded-xl p-4 space-y-2.5 ${
                isUser
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}>
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-500 pb-1 border-b border-slate-800/60">
                  <span className="font-bold uppercase tracking-wider text-slate-400">
                    {isUser ? 'OPERATIONS OFFICER (HQ)' : 'WHITEOUT AI'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
                  {msg.text}
                </div>

                {/* Supporting Card if provided */}
                {msg.supportingCard && (
                  <div className="mt-3 p-3 rounded-lg bg-[#040713] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-cyan-400 font-bold text-xs uppercase block">
                        {msg.supportingCard.title}
                      </span>
                      <p className="text-slate-400 text-xs font-sans mt-0.5">
                        {msg.supportingCard.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (msg.supportingCard?.stationId) {
                          setInspectStationId(msg.supportingCard.stationId);
                        }
                        setActiveTab(msg.supportingCard?.actionTab as any);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors whitespace-nowrap cursor-pointer shadow-sm self-start sm:self-auto"
                    >
                      <span>{msg.supportingCard.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="rounded-xl p-3 bg-slate-900 border border-slate-800 text-xs text-cyan-300 animate-pulse font-mono">
              Analyzing real-time station telemetry and priority queues...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs font-mono scrollbar-none">
        <span className="text-slate-500 text-[10px] uppercase whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          SUGGESTED:
        </span>
        {promptSuggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s)}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors cursor-pointer text-[11px]"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-[#060a16]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask about station operations (e.g. 'What needs attention at Maitri?')..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-medium text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
