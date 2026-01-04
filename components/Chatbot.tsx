"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

/* ---------------- TYPES ---------------- */
type Message = {
  user: boolean;
  text: string;
  timestamp: Date;
};

/* ---------------- ARTICLE HELPERS ---------------- */
const getArticleText = (): string => {
  const el = document.getElementById("article-content");
  return el ? el.innerText.replace(/\s+/g, " ").trim() : "";
};

const summarizeArticle = (text: string): string => {
  if (!text) return "I couldn't find an article on this page.";
  const sentences = text.split(". ");
  return sentences.slice(0, 3).join(". ") + ".";
};

const answerFromArticle = (question: string, article: string): string => {
  if (!article) return "I couldn't find an article to answer from.";

  const qWords = question
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter((w) => w.length > 3);

  const sentences = article.split(". ");

  const match = sentences.find((s) =>
    qWords.some((w) => s.toLowerCase().includes(w))
  );

  return match
    ? match + "."
    : "That detail isn’t clearly stated in the article.";
};

const getFurtherReads = (title: string) => {
  const query = encodeURIComponent(title + " analysis");
  return {
    google: `https://www.google.com/search?q=${query}`,
    chatgpt: `https://chat.openai.com/?q=${query}`,
  };
};

/* ---------------- COMPONENT ---------------- */
const ChatbotUI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articleText, setArticleText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      user: false,
      text: "Hi! 👋 I can summarize this article and answer questions about it.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  /* 🔑 KEYBOARD OFFSET (FIX) */
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------- MOBILE KEYBOARD FIX ---------------- */
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportChange = () => {
      const viewport = window.visualViewport!;
      const offset =
        window.innerHeight - viewport.height - viewport.offsetTop;

      setKeyboardOffset(offset > 0 ? offset : 0);
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport.removeEventListener(
        "resize",
        handleViewportChange
      );
      window.visualViewport.removeEventListener(
        "scroll",
        handleViewportChange
      );
    };
  }, []);

  /* Capture article text once chat opens */
  useEffect(() => {
    if (isOpen) {
      setArticleText(getArticleText());
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /* Auto scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      user: true,
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = userMessage.text.toLowerCase();

      if (lower.includes("summar") || lower.includes("what is this")) {
        reply = summarizeArticle(articleText);
      } else if (
        lower.includes("further") ||
        lower.includes("more") ||
        lower.includes("read")
      ) {
        const links = getFurtherReads(document.title);
        reply =
          "Here are some useful links:\n\n" +
          `🔎 Google: ${links.google}\n\n` +
          `🤖 ChatGPT: ${links.chatgpt}`;
      } else {
        reply = answerFromArticle(userMessage.text, articleText);
      }

      setMessages((prev) => [
        ...prev,
        { user: false, text: reply, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg"
        >
          {isOpen ? <X /> : <MessageCircle />}
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="fixed right-4 sm:right-6 w-[90vw] sm:w-[22rem] md:w-[26rem] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-orange-100"
            style={{
              height: "min(80vh, 600px)",
              bottom: `calc(6rem + ${keyboardOffset}px)`,
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Debt & Dominion"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
                <span className="font-semibold text-sm sm:text-base">
                  Debt & Dominion
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.user ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                      msg.user
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                        : "bg-white text-slate-800 shadow"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-xs text-slate-500">
                  Assistant is typing…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t bg-white flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about this article..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-orange-500 text-white p-2 sm:p-3 rounded-xl disabled:opacity-50"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotUI;
