'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';
import type { ChatMessage } from '@/data/apiContract';

const ADVISORY_CONTEXT = `Advisory: Moisture Stress Watch (Medium Risk, 91% confidence)
Recommendation: Moisture levels are dropping slightly. Inspect soil moisture within 24 hours. If irrigation is available, water the affected section and monitor over the next three days.
Trigger: NDMI dropped below 0.45 threshold
Satellite data: NDVI 0.72 (stable), NDMI 0.41 (declining)
Weather: Rainfall 40% below average, temperature 18°C
Crop stage: Vegetative — moisture sensitive
Field: Nyandarua Shangi Field, 3.5 acres, Shangi variety, planted May 12 2026`;

const QUICK_QUESTIONS = [
  'What does moisture stress mean?',
  'What should I check first?',
  'Eleza kwa Kiswahili',
  'What if I have no irrigation?',
  'How urgent is this?',
];

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

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const farmerMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'farmer',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, farmerMsg]);
    setInput('');
    setIsStreaming(true);

    const replyId = `msg-${Date.now()}-reply`;
    const replyMsg: ChatMessage = {
      id: replyId,
      role: 'fieldpulse',
      text: '',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, replyMsg]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, advisoryContext: ADVISORY_CONTEXT }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error('Failed to connect to AI');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6)) as { content?: string; done?: boolean; error?: string };
            if (data.error) throw new Error(data.error);
            if (data.content) {
              setMessages((prev) =>
                prev.map((m) => m.id === replyId ? { ...m, text: m.text + data.content } : m)
              );
            }
            if (data.done) break;
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const errorText = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setMessages((prev) =>
        prev.map((m) => m.id === replyId ? { ...m, text: errorText } : m)
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming]);

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  };

  return (
    <div className="bg-white border border-[#ECE8E1] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#ECE8E1] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-brand-light-green/40 text-brand-green rounded-lg shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider">Ask FieldPulse AI</h3>
            <p className="text-[10px] text-[#6B6B6B] mt-0.5">Ask in English or Swahili · Powered by AI</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-[10px] text-[#6B6B6B] hover:text-[#171717] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="h-72 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-6 h-6 text-brand-green/50 mb-2" />
            <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
              Ask a question about this advisory. FieldPulse AI answers using your current satellite data, weather, and crop stage.
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
                    <span className="text-[9px] font-semibold text-brand-green uppercase tracking-wider">FieldPulse AI</span>
                  </div>
                )}
                <p className="text-xs leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                  {msg.role === 'fieldpulse' && isStreaming && msg === messages[messages.length - 1] && msg.text === '' && (
                    <span className="inline-flex items-center gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                  {msg.role === 'fieldpulse' && isStreaming && msg === messages[messages.length - 1] && msg.text !== '' && (
                    <span className="inline-block w-0.5 h-3 bg-brand-green ml-0.5 animate-pulse align-middle" />
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick questions (shown only when empty) */}
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

      {/* Input */}
      <div className="border-t border-[#ECE8E1] px-3.5 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
            placeholder="Ask a question about this advisory..."
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
          Answers are based on your field's satellite data, weather, and advisory context.
        </p>
      </div>
    </div>
  );
}
