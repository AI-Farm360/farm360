'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';
import type { ChatMessage } from '@/data/apiContract';

interface MockResponse {
  reply: string;
  sources: string[];
  confidence: number;
}

type ResponseMap = Record<string, MockResponse>;

const exactResponses: ResponseMap = {
  'What does moisture stress mean?': {
    reply:
      'Moisture stress means your potato crop may not be getting enough water. FieldPulse detected that the moisture indicator is falling, so the crop may start struggling if the field stays dry.',
    sources: ['NDMI dropped below 0.45', 'Rainfall 40% below average', 'Crop stage: Vegetative'],
    confidence: 91,
  },
  'What should I check first?': {
    reply:
      'First, check the soil near the roots. If the soil feels dry 5\u201310 cm below the surface, irrigate if possible. Also check whether some parts of the field are drier than others.',
    sources: ['NDMI spatial variation', 'Soil type: Loam', 'Field slope: Gentle'],
    confidence: 88,
  },
  'Can you explain in Swahili?': {
    reply:
      'Msongo wa unyevu humaanisha viazi vinaweza kukosa maji ya kutosha. Kagua udongo leo. Ukiwa mkavu, mwagilia sehemu iliyoathirika kama unaweza.',
    sources: ['Tafsiri ya swali lako', 'Hali ya shamba: viazi', 'Hatua: Mimea'],
    confidence: 85,
  },
  'What if I do not have irrigation?': {
    reply:
      'If you do not have irrigation, prioritize moisture conservation. Reduce unnecessary disturbance of the soil, check drainage patterns, and contact an extension officer if the crop starts wilting.',
    sources: ['Soil moisture retention data', 'Local rainfall forecast: 12mm', 'Crop stage: Vegetative'],
    confidence: 87,
  },
  'How urgent is this?': {
    reply:
      'This is medium risk. You should inspect the field within 24 hours. It is not yet severe, but early action can help prevent crop stress.',
    sources: ['Advisory severity: Medium', 'NDMI trend: Declining 0.41\u21920.38', 'Forecast: Light rain expected'],
    confidence: 93,
  },
  'Eleza kwa Kiswahili': {
    reply:
      'Msongo wa unyevu humaanisha viazi vinaweza kukosa maji ya kutosha. Kagua udongo leo. Ukiwa mkavu, mwagilia sehemu iliyoathirika kama unaweza.',
    sources: ['Tafsiri ya swali lako', 'Hali ya shamba: viazi', 'Hatua: Mimea'],
    confidence: 85,
  },
};

const fallbackMatch = (text: string): MockResponse | null => {
  const lower = text.toLowerCase();

  if (lower.includes('moisture') || lower.includes('stress') || lower.includes('unyevu')) {
    return exactResponses['What does moisture stress mean?'];
  }

  if (lower.includes('check') || lower.includes('kagua') || lower.includes('first') || lower.includes('kwanza')) {
    return exactResponses['What should I check first?'];
  }

  if (
    lower.includes('swahili') ||
    lower.includes('kiswahili') ||
    lower.includes('eleza') ||
    lower.includes('tafsiri')
  ) {
    return exactResponses['Can you explain in Swahili?'];
  }

  if (lower.includes('irrigation') || lower.includes('irrigate') || lower.includes('mwagilia') || lower.includes('maji')) {
    return exactResponses['What if I do not have irrigation?'];
  }

  if (lower.includes('urgent') || lower.includes('urgent') || lower.includes('dharura') || lower.includes('how long')) {
    return exactResponses['How urgent is this?'];
  }

  return null;
};

const genericResponse: MockResponse = {
  reply:
    'I can help you understand this advisory better. Try one of the suggested questions above, or ask about moisture, irrigation, urgency, or ask for a Swahili explanation.',
  sources: ['Current advisory knowledge base'],
  confidence: 82,
};

const detectLanguage = (text: string): 'en' | 'sw' => {
  const swahiliWords = ['kwa', 'ni', 'ya', 'na', 'wa', 'kutoa', 'kutosha', 'viazi', 'udongo', 'maji', 'kagua', 'mwagilia', 'sehemu', 'shamba', 'hatua', 'mimea', 'dharura', 'tafsiri', 'kiswahili', 'eleza', 'kwanza'];
  const lower = text.toLowerCase();
  return swahiliWords.some((w) => lower.includes(w)) ? 'sw' : 'en';
};

const getResponse = (text: string): MockResponse => {
  return exactResponses[text] ?? fallbackMatch(text) ?? genericResponse;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (isTyping) return;

      const lang = detectLanguage(trimmed);

      const farmerMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'farmer',
        text: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, farmerMsg]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const resp = getResponse(trimmed);
        const fieldpulseMsg: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: 'fieldpulse',
          text: resp.reply,
          timestamp: new Date().toISOString(),
          sources: resp.sources,
          confidence: resp.confidence,
        };
        setMessages((prev) => [...prev, fieldpulseMsg]);
        setIsTyping(false);
      }, 1000 + Math.random() * 400);
    },
    [isTyping],
  );

  const quickQuestions = [
    'What does moisture stress mean?',
    'What should I check first?',
    'Can you explain in Swahili?',
    'What if I do not have irrigation?',
    'How urgent is this?',
  ];

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-[#ECE8E1]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Ask FieldPulse</h3>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">
              Ask questions about this advisory in simple English or Swahili.
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="h-72 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-6 h-6 text-brand-green/50 mb-2" />
            <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
              Ask a question about this advisory. FieldPulse answers using your current advisory, weather, and satellite
              evidence.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === 'farmer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                  msg.role === 'farmer'
                    ? 'bg-brand-green text-white rounded-br-md'
                    : 'bg-[#FAF9F6] text-[#171717] rounded-bl-md border border-[#ECE8E1]'
                }`}
              >
                {msg.role === 'fieldpulse' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full bg-brand-green/20 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-brand-green">FP</span>
                    </div>
                    <span className="text-[9px] font-semibold text-brand-green uppercase tracking-wider">FieldPulse</span>
                  </div>
                )}
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.role === 'fieldpulse' && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#E5E0D8]/60">
                    <p className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Evidence</p>
                    <ul className="space-y-0.5">
                      {msg.sources.map((s, i) => (
                        <li key={i} className="text-[9px] text-[#6B6B6B] flex items-start gap-1">
                          <span className="text-brand-green mt-0.5 shrink-0">&#8226;</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                    {msg.confidence !== undefined && (
                      <p className="text-[9px] text-[#6B6B6B] mt-1 font-medium">
                        Confidence: {msg.confidence}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-[#FAF9F6] border border-[#ECE8E1] rounded-2xl rounded-bl-md px-3.5 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-brand-green/20 flex items-center justify-center">
                  <span className="text-[7px] font-bold text-brand-green">FP</span>
                </div>
                <span className="text-[9px] font-semibold text-brand-green uppercase tracking-wider">FieldPulse</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="px-5 pb-3">
          <p className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">Quick Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-[11px] bg-[#FAF9F6] hover:bg-brand-light-green/20 border border-[#ECE8E1] text-[#171717] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[#ECE8E1] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage(input);
            }}
            placeholder="Ask a question about this advisory..."
            className="flex-1 text-xs bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg px-3 py-2 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all placeholder:text-[#6B6B6B]/60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-[#6B6B6B] mt-2">
          FieldPulse answers using your current advisory, weather, and satellite evidence.
        </p>
      </div>
    </div>
  );
}
