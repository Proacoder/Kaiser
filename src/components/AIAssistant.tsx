import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bot, X, Send, Loader2, Minimize2, Maximize2, Sparkles, 
  Trash2, ExternalLink, ShieldCheck, MapPin, Building2, PhoneCall, Activity
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  source?: string;
  timestamp?: string;
};

const CATEGORIZED_CHIPS = [
  { label: "⚡ Report Pothole", query: "How do I report a pothole?" },
  { label: "📊 Ward Rankings", query: "Which ward has the highest health score rank?" },
  { label: "📍 Bandra / Dadar Wards", query: "Which ward handles Bandra and Dadar?" },
  { label: "⏱️ SLA Timelines", query: "What are the SLA timelines for critical issues?" },
  { label: "🔥 Ward Hotspots", query: "Where are the pothole hotspots in Mumbai?" },
  { label: "🚨 Disaster Hotline 1916", query: "What is the BMC Emergency helpline number?" },
];

export const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "👋 **Welcome to KAISER Civic AI Assistant!**\n\nI provide real-time assistance for Mumbai's 24 Municipal Wards. Ask me about reporting grievances, SLA timelines, AMC officer contacts, ward health ranks, or flood emergency protocols.",
      source: "BMC AI Core",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, thinking]);

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.reply || "I am analyzing municipal records. Please verify details on the 24-Ward map.",
        source: data.source || "Gemini 2.5 + Ward GIS",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: "⚠️ System connection issue. For immediate assistance, call **1916** BMC Helpline.",
          source: "Offline Mode",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        text: "Chat cleared. How can I assist you with Mumbai municipal services today?",
        source: "System",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
    ]);
  };

  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="space-y-1 font-mono text-xs">
        {lines.map((line, lIdx) => {
          const boldMatch = line.split(/\*\*([^*]+)\*\*/g);
          return (
            <p key={lIdx} className={line.startsWith("•") || line.startsWith("-") ? "pl-2" : ""}>
              {boldMatch.map((part, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="font-bold text-[#242424]">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button — Monad Lake Blue Accent */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group border border-white/20 cursor-pointer"
          aria-label="Open KAISER AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#2b59d1] animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col text-left font-mono">
            <span className="text-xs font-medium uppercase tracking-wider leading-none">KAISER AI</span>
            <span className="text-[9px] text-[#cfdaf5] uppercase leading-tight">Civic Assistant</span>
          </div>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-[#f6f3f1] rounded-[32px] shadow-2xl border border-[#cecac8] flex flex-col overflow-hidden transition-all duration-300 font-mono text-[#242424] ${
            expanded ? "w-[94vw] sm:w-[480px] h-[580px]" : "w-[90vw] sm:w-[380px] h-[490px]"
          } ${minimised ? "h-14 overflow-hidden" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#242424] text-white shrink-0 justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#2b59d1] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono font-medium uppercase tracking-wider leading-none flex items-center gap-1.5 text-white">
                  <span>KAISER Civic AI</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono border border-emerald-500/30 uppercase">
                    Live
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#cecac8] mt-0.5 truncate">
                  24-Ward Municipal Intelligence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-full text-[#cecac8] hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="p-1.5 rounded-full text-[#cecac8] hover:text-white hover:bg-white/10 transition hidden sm:block cursor-pointer"
                title={expanded ? "Contract" : "Expand"}
              >
                {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full text-[#cecac8] hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimised && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f6f3f1]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-[#2b59d1] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[88%] px-4 py-3 rounded-[20px] text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#2b59d1] text-white rounded-br-xs font-mono"
                          : "bg-white text-[#242424] border border-[#cecac8] rounded-bl-xs font-mono"
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                      {msg.source && (
                        <div className="mt-2 pt-1.5 border-t border-[#cecac8]/40 flex items-center justify-between text-[9px] font-mono text-[#797776] uppercase">
                          <span>{msg.source}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {thinking && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2b59d1] flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white border border-[#cecac8] rounded-[20px] px-4 py-2.5 flex items-center gap-2 text-xs text-[#797776] font-mono">
                      <Loader2 className="w-3.5 h-3.5 text-[#2b59d1] animate-spin" />
                      <span>Consulting BMC Intelligence...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Question Chips */}
              <div className="px-3 py-2 bg-[#cfdaf5]/50 border-t border-[#cecac8]">
                <div className="text-[9px] font-mono uppercase text-[#797776] mb-1.5 flex items-center justify-between">
                  <span>Suggested Municipal Queries</span>
                  <span className="text-[9px] text-[#797776]">Click to ask</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar font-mono">
                  {CATEGORIZED_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => send(chip.query)}
                      className="text-[10px] px-3 py-1 bg-white border border-[#cecac8] rounded-full text-[#242424] hover:border-[#2b59d1] hover:text-[#2b59d1] transition font-mono uppercase shrink-0 cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-[#cecac8] bg-white shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask KAISER AI about ward boundaries, SLAs..."
                  className="flex-1 text-xs font-mono bg-[#f6f3f1] border border-[#cecac8] rounded-full px-4 py-2 outline-none focus:border-[#2b59d1] text-[#242424]"
                  disabled={thinking}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || thinking}
                  className="w-9 h-9 rounded-full bg-[#2b59d1] hover:bg-[#2247ab] disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
