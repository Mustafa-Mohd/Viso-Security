import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Loader2,
  RotateCcw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "@/lib/chatbot";
import { getFastTrackAnswer } from "@/data/chatbotBrain";

const VISO_LOGO_URL =
  "https://res.cloudinary.com/dcefror3c/image/upload/v1786611747/Luxurious_black_and_gold_logo_design_kjv4np__1_-removebg-preview_jvmtcu.png";

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
              className="pointer-events-auto w-full h-full sm:h-[590px] sm:w-[430px] sm:max-w-[calc(100vw-2rem)] bg-white border border-neutral-200/90 sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden text-neutral-900"
              style={{ direction: i18n.dir() }}
            >
              {/* Header */}
              <div className="bg-neutral-50/95 border-b border-neutral-200/80 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-white border border-gold/50 p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                    <img
                      src={VISO_LOGO_URL}
                      alt="VISO Logo"
                      className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(212,175,55,0.4)]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm text-neutral-900">
                        {isArabic ? "مساعد فيسو الذكي" : "VISO AI Assistant"}
                      </h3>
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono font-semibold tracking-wider text-amber-800 bg-amber-500/10 rounded border border-amber-500/30">
                        {isArabic ? "معتمد" : "OFFICIAL"}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-medium">
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
                    className="p-2 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-900 transition-colors"
                    aria-label="Reset chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-900 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50 scrollbar-thin scrollbar-thumb-neutral-300">
                {messages.map((msg) => {
                  const msgIsArabic = isArabicText(msg.content);
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-white border border-gold/40 p-0.5 shadow-xs shrink-0 flex items-center justify-center mb-0.5">
                          <img
                            src={VISO_LOGO_URL}
                            alt="VISO"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div
                        dir={msgIsArabic ? "rtl" : "ltr"}
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msgIsArabic ? "text-right font-arabic" : "text-left"
                        } ${
                          isUser
                            ? "bg-gold text-neutral-950 font-medium rounded-br-xs shadow-xs"
                            : "bg-white border border-neutral-200 text-neutral-900 rounded-bl-xs shadow-xs"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div
                            dir={msgIsArabic ? "rtl" : "ltr"}
                            className="prose prose-neutral prose-sm max-w-none text-neutral-900 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-neutral-950 prose-headings:text-neutral-950"
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
                  <div className="flex items-end gap-2 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-white border border-gold/40 p-0.5 shadow-xs shrink-0 flex items-center justify-center mb-0.5">
                      <img
                        src={VISO_LOGO_URL}
                        alt="VISO"
                        className="w-full h-full object-contain animate-pulse"
                      />
                    </div>
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white border border-neutral-200 text-neutral-700 rounded-bl-xs flex items-center gap-2 shadow-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span className="text-xs text-neutral-500 font-medium">
                        {isArabic ? "جاري التفكير وصياغة الإجابة..." : "Analyzing with VISO AI..."}
                      </span>
                    </div>
                  </div>
                )}

                {lastError && !isLoading && (
                  <div className="flex justify-center my-1">
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-xs"
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
                <div className="px-4 py-2.5 border-t border-neutral-200 bg-white">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 font-mono font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    {isArabic ? "أسئلة شائعة ومقترحة:" : "Suggested topics:"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="text-[11px] text-left text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-gold/15 border border-neutral-200/90 hover:border-gold/60 px-2.5 py-1 rounded-full transition-all text-ellipsis overflow-hidden cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
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
                    className="flex-1 bg-neutral-100 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gold focus:border-gold transition-all disabled:opacity-50"
                    dir="auto"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-gold text-neutral-950 flex justify-center items-center font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0 cursor-pointer shadow-md"
                    aria-label="Send"
                  >
                    <Send className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
                  </button>
                </form>
                <div className="mt-1.5 flex justify-between items-center text-[10px] text-neutral-400 px-1 font-mono">
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
          className="relative group w-14 h-14 rounded-full bg-white border-2 border-gold/70 text-neutral-900 shadow-xl flex items-center justify-center cursor-pointer transition-shadow hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          aria-label="Toggle VISO AI Assistant"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping opacity-30 pointer-events-none" />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-neutral-800" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative w-8 h-8 flex items-center justify-center"
              >
                <img
                  src={VISO_LOGO_URL}
                  alt="VISO Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(212,175,55,0.4)]"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Tooltip */}
          <span className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-neutral-900 text-white text-[11px] font-medium tracking-wide px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            {isArabic ? "مساعد فيسو الذكي" : "Chat with VISO AI"}
          </span>
        </motion.button>
      </div>
    </>
  );
}
