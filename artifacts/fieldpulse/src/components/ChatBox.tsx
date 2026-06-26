'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';
import type { ChatMessage } from '@/data/apiContract';

const QUICK_QUESTIONS = [
  'What does moisture stress mean?',
  'What should I check first?',
  'Eleza kwa Kiswahili',
  'What if I have no irrigation?',
  'How urgent is this?',
];

interface AIResponse {
  text: string;
  sources: string[];
}

const detectSwahili = (text: string) => {
  const words = ['kwa', 'ni', 'ya', 'na', 'wa', 'eleza', 'viazi', 'udongo', 'maji', 'mwagilia', 'shamba', 'msongo', 'dharura', 'kiswahili', 'kwanza', 'sehemu', 'kagua', 'unyevu', 'hatua'];
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
};

const getAIResponse = (text: string): AIResponse => {
  const lower = text.toLowerCase();
  const isSw = detectSwahili(text);

  if (lower.includes('eleza') || lower.includes('kiswahili') || lower.includes('swahili')) {
    return {
      text: 'Msongo wa unyevu unamaanisha viazi vyako havipati maji ya kutosha. Dalili za setilaiti zinaonyesha unyevu unashuka taratibu. Kagua udongo sentimita 5-10 chini ya uso — ukiwa mkavu, mwagilia sehemu iliyoathirika haraka iwezekanavyo. Angalia shamba lako ndani ya masaa 24.',
      sources: ['NDMI imeshuka chini ya 0.45', 'Mvua 40% chini ya wastani', 'Hatua ya ukuaji: Mimea'],
    };
  }

  if (lower.includes('moisture') || lower.includes('stress') || lower.includes('unyevu') || lower.includes('msongo')) {
    return {
      text: isSw
        ? 'Msongo wa unyevu unamaanisha viazi vinaweza kukosa maji. Setilaiti yetu imeona NDMI inashuka chini ya kiwango salama cha 0.45. Kagua udongo leo ndani ya masaa 24.'
        : 'Moisture stress means your potato crop may not be getting enough water. Our satellite detected the moisture index (NDMI) dropping below the safe threshold of 0.45. The vegetative stage is especially sensitive to water shortages — inspect your soil today.',
      sources: ['NDMI dropped below 0.45', 'Rainfall 40% below average', 'Crop stage: Vegetative (moisture-sensitive)'],
    };
  }

  if (lower.includes('check') || lower.includes('kwanza') || lower.includes('kagua') || lower.includes('first')) {
    return {
      text: isSw
        ? 'Kwanza, kagua udongo karibu na mizizi ya viazi. Chimba sentimita 5-10 chini — ukiwa mkavu na mwanga, mwagilia haraka. Angalia pia sehemu gani za shamba zina rangi ya njano au zinazochea.'
        : 'Start by checking the soil near the potato roots — dig 5-10 cm down. If it feels dry and crumbles, you need to act. Also look for yellowing leaves or wilting patches, which may indicate the most stressed zones. Check the east side of the field first where the NDVI stress was detected.',
      sources: ['NDVI stress zones: eastern quadrant', 'NDMI: 0.41 (declining)', 'Soil type: Loam (moderate retention)'],
    };
  }

  if (lower.includes('irrigation') || lower.includes('mwagilia') || lower.includes('maji') || lower.includes('water')) {
    return {
      text: isSw
        ? 'Ukiwa huna umwagiliaji, jaribu kuhifadhi unyevu uliopo. Usivuruge udongo bure. Funika udongo kwa majani makavu (mulching) ili kuzuia uvaporishaji. Wasiliana na afisa wa kilimo wa eneo lako kama mmea unaanza kunyauka.'
        : 'Without irrigation, focus on moisture conservation: avoid unnecessary tillage that speeds up evaporation, apply mulch (dry grass/crop residue) around plants to retain soil moisture, and prioritize any available water for the most stressed zone. A forecast of 12mm light rain is expected soon — this may provide short-term relief.',
      sources: ['Forecast: 12mm light rain expected', 'Soil moisture retention: Loam (moderate)', 'Mulching reduces evaporation by ~30%'],
    };
  }

  if (lower.includes('urgent') || lower.includes('dharura') || lower.includes('haraka') || lower.includes('how long') || lower.includes('time')) {
    return {
      text: isSw
        ? 'Hii ni hatari ya kiwango cha kati. Una masaa 24 kabla ya hali kuwa mbaya zaidi. Sio dharura ya haraka sana, lakini usisubiri — hatua za mapema zinazuia uharibifu mkubwa wa mazao.'
        : 'This is Medium Risk — you have roughly 24 hours before conditions worsen. The NDMI trend shows a consistent decline over 3 days (0.45 → 0.41). If you act now, you can prevent yield loss. If ignored for 3+ days without rain, it could escalate to High Risk.',
      sources: ['Advisory severity: Medium', 'NDMI trend: 0.45 → 0.41 over 3 days', 'Forecast: Light rain, insufficient alone'],
    };
  }

  if (lower.includes('blight') || lower.includes('disease') || lower.includes('ugonjwa') || lower.includes('fungal')) {
    return {
      text: isSw
        ? 'Blight (ukungu wa viazi) husababishwa na unyevu wa juu na baridi. Kwa sasa, hali ya mvua chini ya wastani inapunguza hatari ya blight. Lakini angalia majani ya chini kwa madoa meusi au kahawia.'
        : 'Late blight risk is currently low because rainfall is 40% below average — blight thrives in wet, cool conditions. However, if rain returns, humidity could spike quickly. Inspect the lower leaves for dark brown spots or white fungal growth on the underside as a precaution.',
      sources: ['Rainfall: 40% below average (low blight risk)', 'Temperature: 18°C (borderline for blight)', 'Humidity: 72% (moderate)'],
    };
  }

  if (lower.includes('ndvi') || lower.includes('ndmi') || lower.includes('satellite') || lower.includes('setilaiti') || lower.includes('index')) {
    return {
      text: isSw
        ? 'NDVI (0.72) inaonyesha mimea iko nzuri kwa ujumla. NDMI (0.41) inaonyesha unyevu unashuka — hii ndiyo chanzo cha onyo hili. Maadili salama ya NDMI kwa viazi ni 0.45 au zaidi.'
        : 'NDVI at 0.72 means your crop\'s vegetation is generally healthy and green. NDMI at 0.41 is the concern — it tracks canopy moisture, and dropping below 0.45 signals early water stress. Think of NDVI as "how green" and NDMI as "how hydrated". Both are derived from Sentinel-2 satellite imagery processed every 3-5 days.',
      sources: ['NDVI: 0.72 (healthy threshold: >0.5)', 'NDMI: 0.41 (stress threshold: <0.45)', 'Sentinel-2 pass: Jun 25, 2026'],
    };
  }

  return {
    text: isSw
      ? 'Ninaweza kukusaidia kuelewa ushauri huu vizuri zaidi. Jaribu kuuliza kuhusu msongo wa unyevu, umwagiliaji, dharura ya hali, au data ya setilaiti. Unaweza pia kuuliza kwa Kiingereza.'
      : 'I can help you understand this advisory better. Try asking about the moisture stress, whether you need irrigation, how urgent the situation is, what the satellite indices mean, or disease risk. I\'m here to help you make the best decision for your field.',
    sources: ['Current advisory: Moisture Stress Watch', 'Field: Nyandarua Shangi Field'],
  };
};

const streamText = (
  text: string,
  onChunk: (partial: string) => void,
  onDone: () => void,
  signal: AbortSignal
) => {
  const words = text.split(' ');
  let i = 0;
  let accumulated = '';

  const step = () => {
    if (signal.aborted) return;
    if (i >= words.length) { onDone(); return; }
    const chunk = (i === 0 ? '' : ' ') + words[i];
    accumulated += chunk;
    onChunk(accumulated);
    i++;
    const delay = 18 + Math.random() * 22;
    setTimeout(step, delay);
  };
  setTimeout(step, 120);
};

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setMessages((prev) => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'farmer',
      text: trimmed,
      timestamp: new Date().toISOString(),
    }]);
    setInput('');
    setIsStreaming(true);

    const replyId = `msg-${Date.now()}-reply`;
    setMessages((prev) => [...prev, {
      id: replyId,
      role: 'fieldpulse',
      text: '',
      timestamp: new Date().toISOString(),
    }]);

    const response = getAIResponse(trimmed);
    abortRef.current = new AbortController();

    streamText(
      response.text,
      (partial) => {
        setMessages((prev) =>
          prev.map((m) => m.id === replyId ? { ...m, text: partial } : m)
        );
      },
      () => {
        setMessages((prev) =>
          prev.map((m) => m.id === replyId ? { ...m, text: response.text, sources: response.sources } : m)
        );
        setIsStreaming(false);
        abortRef.current = null;
      },
      abortRef.current.signal,
    );
  }, [isStreaming]);

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  };

  const lastMsg = messages[messages.length - 1];

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-[#ECE8E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Ask FieldPulse AI</h3>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">Ask in English or Swahili · Advisory-aware</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-[10px] text-[#6B6B6B] hover:text-[#171717] flex items-center gap-1 transition-colors cursor-pointer">
            <RefreshCw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div ref={scrollRef} className="h-72 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-6 h-6 text-brand-green/50 mb-2" />
            <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
              Ask a question about this advisory in English or Swahili. Answers use your satellite data, weather, and crop context.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'farmer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                msg.role === 'farmer'
                  ? 'bg-brand-green text-white rounded-br-md'
                  : 'bg-[#FAF9F6] text-[#171717] rounded-bl-md border border-[#ECE8E1]'
              }`}>
                {msg.role === 'fieldpulse' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full bg-brand-green/20 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-brand-green">FP</span>
                    </div>
                    <span className="text-[9px] font-semibold text-brand-green uppercase tracking-wider">FieldPulse AI</span>
                  </div>
                )}

                {msg.role === 'fieldpulse' && msg.text === '' ? (
                  <div className="flex items-center gap-1 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                    {msg.role === 'fieldpulse' && isStreaming && msg === lastMsg && (
                      <span className="inline-block w-0.5 h-3 bg-brand-green ml-0.5 animate-pulse align-middle" />
                    )}
                  </p>
                )}

                {msg.role === 'fieldpulse' && msg.sources && msg.sources.length > 0 && !isStreaming && (
                  <div className="mt-2 pt-2 border-t border-[#E5E0D8]/60">
                    <p className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">Evidence</p>
                    <ul className="space-y-0.5">
                      {msg.sources.map((s, i) => (
                        <li key={i} className="text-[9px] text-[#6B6B6B] flex items-start gap-1">
                          <span className="text-brand-green mt-0.5 shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {messages.length === 0 && (
        <div className="px-5 pb-3">
          <p className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-2">Quick Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isStreaming}
                className="text-[11px] bg-[#FAF9F6] hover:bg-brand-light-green/20 border border-[#ECE8E1] text-[#171717] font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-40"
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
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
            placeholder="Ask about this advisory..."
            disabled={isStreaming}
            className="flex-1 text-xs bg-[#FAF9F6] border border-[#E5E0D8] rounded-lg px-3 py-2 outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 transition-all placeholder:text-[#6B6B6B]/60 disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="p-2 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-[#6B6B6B] mt-2">
          Advisory-aware · Answers use your satellite, weather &amp; crop data
        </p>
      </div>
    </div>
  );
}
