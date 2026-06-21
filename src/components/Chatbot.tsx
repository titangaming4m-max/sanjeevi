import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface ChatbotProps {
  quickReplies: string[];
  enabled: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chatbot({ quickReplies, enabled }: ChatbotProps) {
  if (!enabled) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Initialize Connection: ONLINE. Hi! I'm the AI Assistant. Ask me anything about skills, service rates, source codes, or how to customize this website!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean up speaker synthesis when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakMessage = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis is not supported in this browser.");
      return;
    }

    // If currently speaking this message, toggle off
    if (currentlySpeakingId === id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    // Cancel current reading session first
    window.speechSynthesis.cancel();

    // Strip formatting like markdown symbols for clean recitation
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.onstart = () => {
      setCurrentlySpeakingId(id);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }
  };

  const handleClose = () => {
    stopSpeaking();
    setIsOpen(false);
  };

  // Auto scroll to latest chats
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  // Auto-speak new incoming replies if enabled
  useEffect(() => {
    if (messages.length > 0 && autoRead) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        speakMessage(lastMessage.text, lastMessage.id);
      }
    }
  }, [messages, autoRead]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      // Map history for context
      const chatHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        sender: 'bot',
        text: data.response || "No response received. Ensure your LLM API server is connected.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'reply_error_' + Date.now(),
        sender: 'bot',
        text: "Error synchronizing data. Verify your server endpoint is active and keys are secure.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Dynamic Floating Glass Chat Box */}
      {isOpen && (
        <div className="w-80 h-[450px] sm:w-[350px] sm:h-[500px] rounded-3xl glass-panel-heavy border border-white/10 shadow-[0_10px_50px_rgba(138,43,226,0.35)] flex flex-col overflow-hidden mb-4 transition-all duration-300 relative text-left">
          
          {/* Neon Header glow bar */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
          
          {/* Chat box Header */}
          <div className="px-5 py-4 bg-slate-950/20 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-pink p-[1px] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#0d071b] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-neon-pink animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full border border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider leading-none">AI Companion</h4>
                <span className="text-[9px] font-mono tracking-widest text-[#00bfff] uppercase">System Live</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setAutoRead(!autoRead)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  autoRead 
                    ? 'bg-neon-purple/20 border-neon-purple/40 text-neon-pink' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
                title={autoRead ? 'Mute AI speech read-out' : 'Enable real-time AI reply speech read-out'}
              >
                {autoRead ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Message Thread Body */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-tr from-neon-purple to-neon-blue text-white rounded-tr-none shadow-md font-medium' 
                    : 'bg-black/90 border border-white/15 text-white font-medium rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[8px] font-mono text-slate-500 uppercase">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakMessage(msg.text, msg.id)}
                      className={`text-[8px] font-mono uppercase tracking-wide hover:text-white flex items-center space-x-1 border px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                        currentlySpeakingId === msg.id 
                          ? 'border-neon-pink text-neon-pink bg-neon-pink/10 animate-pulse font-bold' 
                          : 'border-white/5 text-slate-400 hover:bg-white/5'
                      }`}
                      title={currentlySpeakingId === msg.id ? 'Stop reading' : 'Read announcement aloud'}
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>{currentlySpeakingId === msg.id ? 'STOP' : 'PLAY'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Loader simulation */}
            {loading && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className="px-4 py-3 rounded-2xl bg-black/90 border border-white/10 rounded-tl-none flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-pink animate-bounce delay-100"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-purple animate-bounce delay-200"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-blue animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies scroll row */}
          {quickReplies && quickReplies.length > 0 && (
            <div className="px-3 py-2 bg-slate-950/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto select-none no-scrollbar">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-slate-300 hover:text-white rounded-md bg-white/5 border border-white/5 hover:border-neon-purple/40 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input text controls bar */}
          <div className="p-3 bg-slate-950/20 border-t border-white/5 flex items-center space-x-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask the terminal..."
              className="flex-grow px-3.5 py-2 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-neon-purple outline-none"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              className="p-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink hover:scale-105 active:scale-95 text-white cursor-pointer transition-transform duration-100 flex items-center justify-center shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* Primary Activation Floating Icon */}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-neon-purple via-neon-pink to-neon-blue p-[2px] shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(255,77,255,0.5)] transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative group"
        id="chatbot-trigger-btn"
      >
        <div className="absolute -inset-1 bg-gradient-to-tr from-neon-purple to-neon-pink rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity -z-10 animate-pulse"></div>
        <div className="w-full h-full rounded-full bg-[#0d071d] flex items-center justify-center">
          {isOpen ? <X className="w-5 h-5 text-white" /> : <MessageSquare className="w-6 h-6 text-[#ff4dff] animate-pulse" />}
        </div>
      </button>

    </div>
  );
}
