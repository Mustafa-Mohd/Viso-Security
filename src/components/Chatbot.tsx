import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "@/lib/chatbot";
import { getFastTrackAnswer } from "@/data/chatbotBrain";

type Message = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Checks if a string contains predominantly Arabic characters
 */
function isArabicText(text: string): boolean {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const isArabic = i18n.language === "ar";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips based on language
  const suggestedQuestions = isArabic
    ? [
        "ما هي خدمات فيسو للأمن الصناعي؟",
        "ما هي التراخيص والاعتمادات الرسمية؟",
        "ما هو إطار العمل ذو المراحل الأربع؟",
        "أين تقع مكاتب وفروع فيسو؟",
        "ما هي خدمات إدارة المشاريع والإشراف؟",
      ]
    : [
        "What are VISO's security services?",
        "What licenses & certifications do you hold?",
        "Explain the 4-Stage Security Framework",
        "Where are VISO's offices located?",
        "What project management services do you provide?",
      ];

  // Initialize with localized greeting
  const resetChat = React.useCallback(() => {
    setLastError(null);
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: isArabic
          ? "مرحباً بك في **شركة رؤية الحلول للاستشارات الأمنية (VISO)**. أنا مساعدك الذكي المعتمد للإجابة عن خدماتنا الاستشارية، هندسة الأمن المادي، تراخيصنا، ومعايير الهيئة العليا للأمن الصناعي (HCIS). كيف يمكنني خدمتك اليوم؟"
          : "Welcome to **VISO (Vision of Solutions for Security Consultations Co. Ltd)**. I am your specialized AI assistant for our physical security engineering, licenses, HCIS compliance, project supervision, and translation services. How may I assist your facility today?",
      },
    ]);
  }, [isArabic]);

  useEffect(() => {
    resetChat();
  }, [resetChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    setLastError(null);
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    // Fast-track for high-confidence exact FAQ matches (with intent guardrails)
    const fastAnswer = getFastTrackAnswer(trimmed, i18n.language);
    if (fastAnswer) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: fastAnswer },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const responseText = await sendChatMessage(newHistory, i18n.language);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: responseText },
      ]);
    } catch (error: unknown) {
      console.error("[VISO AI] Chatbot processing error:", error);
      const fallbackText = isArabic
        ? "عذراً، حدث تأخر أثناء معالجة استفسارك. يرجى المحاولة مرة أخرى أو التواصل مع فريقنا مباشرة عبر info@visogroup.com."
        : "I apologize, there was a temporary delay in processing your request. Please try again or reach out to us at info@visogroup.com.";
      setLastError(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: fallbackText },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastError) {
      const retryText = lastError;
      setLastError(null);
      handleSend(retryText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[150] flex flex-col items-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.94 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto w-full h-full sm:h-[580px] sm:w-[420px] sm:max-w-[calc(100vw-2rem)] bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ direction: i18n.dir() }}
            >
              {/* Header */}
              <div className="bg-white/[0.03] border-b border-white/10 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                    <ShieldCheck className="w-5 h-5 text-gold" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d1117]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-semibold text-sm text-white">
                        {isArabic ? "مساعد فيسو الذكي" : "VISO AI Assistant"}
                      </h3>
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono tracking-wider text-gold bg-gold/10 rounded border border-gold/30">
                        {isArabic ? "معتمد" : "OFFICIAL"}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50">
                      {isArabic
                        ? "استشارات الأمن المادي ومعايير HCIS"
                        : "Physical Security & HCIS Consulting"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={resetChat}
                    title={isArabic ? "إعادة بدء المحادثة" : "Reset conversation"}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-gold transition-colors"
                    aria-label="Reset chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((msg) => {
                  const msgIsArabic = isArabicText(msg.content);
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        dir={msgIsArabic ? "rtl" : "ltr"}
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msgIsArabic ? "text-right font-arabic" : "text-left"
                        } ${
                          msg.role === "user"
                            ? "bg-gold text-black font-medium rounded-br-xs shadow-md"
                            : "bg-white/[0.05] border border-white/10 text-white/90 rounded-bl-xs shadow-sm"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div
                            dir={msgIsArabic ? "rtl" : "ltr"}
                            className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 text-white/90"
                          >
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white/[0.05] border border-white/10 text-white/80 rounded-bl-xs flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span className="text-xs text-white/60">
                        {isArabic ? "جاري التفكير وصياغة الإجابة..." : "Analyzing with VISO AI..."}
                      </span>
                    </div>
                  </div>
                )}

                {lastError && !isLoading && (
                  <div className="flex justify-center my-1">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{isArabic ? "إعادة المحاولة" : "Retry query"}</span>
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01]">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-gold" />
                    {isArabic ? "أسئلة شائعة ومقترحة:" : "Suggested topics:"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="text-[11px] text-left text-white/70 hover:text-white bg-white/[0.04] hover:bg-gold/15 border border-white/10 hover:border-gold/40 px-2.5 py-1 rounded-full transition-all text-ellipsis overflow-hidden"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 bg-white/[0.02] border-t border-white/10 shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isArabic
                        ? "اطرح سؤالك أو اطلب ترجمة فورية..."
                        : "Ask about VISO services, HCIS, or request translation..."
                    }
                    disabled={isLoading}
                    className="flex-1 bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-all disabled:opacity-50"
                    dir="auto"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-gold text-black flex justify-center items-center font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0 cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                    aria-label="Send"
                  >
                    <Send className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
                  </button>
                </form>
                <div className="mt-1.5 flex justify-between items-center text-[10px] text-white/40 px-1 font-mono">
                  <span>VISO Security Intelligence</span>
                  <span>
                    {isArabic ? "ذكاء اصطناعي ثنائي اللغة" : "Multilingual Context-Aware AI"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <div className="fixed bottom-24 right-6 z-[95]">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full bg-gradient-to-tr from-[#161b22] to-[#21262d] border border-gold/40 text-gold shadow-2xl flex items-center justify-center cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          aria-label="Toggle VISO AI Assistant"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full border border-gold/30 animate-ping opacity-30 pointer-events-none" />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6 text-gold" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Tooltip */}
          <span className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-black/85 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {isArabic ? "مساعد فيسو الذكي" : "Chat with VISO AI"}
          </span>
        </motion.button>
      </div>
    </>
  );
}
