"use client";
import { useState, useRef, useEffect } from "react";
import { MIcon } from "./MIcon";
import { FadeUp } from "./FadeUp";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    text: "Welcome to AlumNow! I'll help you find the right alumni mentor for your journey. What are you looking for guidance on?",
  },
  {
    role: "user",
    text: "I want to connect with someone who studied at IIT Bombay and can help me with my university applications.",
  },
  {
    role: "assistant",
    text: "Great choice! We have verified IIT Bombay alumni who specialise in application guidance. I can show you profiles with matching availability and pricing. Shall I filter by your preferred session type?",
  },
];

interface ChatPanelProps {
  initialScroll?: "top" | "bottom";
  animateMessagesIn?: boolean;
}

export function ChatPanel({ initialScroll = "bottom", animateMessagesIn = false }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      if (initialScroll === "top") {
        scrollRef.current.scrollTop = 0;
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [initialScroll]);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input.trim() };
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", text: "Let me find the best alumni match for that. One moment..." },
    ]);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[rgba(8,8,10,0.6)] backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5">
          <MIcon name="auto_awesome" size={14} className="text-white/60" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">AlumNow</p>
          <p className="truncate text-[11px] text-white/40">Find your mentor</p>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const content = animateMessagesIn ? (
            <FadeUp delay={i * 0.12} y={16}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "ml-auto bg-white/15 text-white/90"
                    : "bg-white/5 text-white/70 border border-white/5"
                }`}
              >
                {msg.text}
              </div>
            </FadeUp>
          ) : (
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                isUser
                  ? "ml-auto bg-white/15 text-white/90"
                  : "bg-white/5 text-white/70 border border-white/5"
              }`}
            >
              {msg.text}
            </div>
          );

          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              {content}
            </div>
          );
        })}
      </div>

      <div className="liquid-glass mx-3 mb-3 flex items-end gap-2 rounded-2xl px-3 py-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about alumni mentors..."
          rows={1}
          className="min-h-[20px] flex-1 resize-none bg-transparent text-sm text-white/80 placeholder:text-white/30 outline-none"
        />
        <button
          onClick={sendMessage}
          className="flex shrink-0 items-center justify-center rounded-xl bg-white p-2 text-black transition-colors hover:bg-white/90"
        >
          <MIcon name="arrow_upward" size={16} />
        </button>
      </div>
    </div>
  );
}
