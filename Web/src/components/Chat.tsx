import React, { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, BotMessageSquare } from "lucide-react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { useAuthStore } from "../store/authStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = import.meta.env.VITE_API_URL;

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useAuthStore();

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents(`${API_URL}/chatbot`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95"
      >
        {isOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
      </button>

      {/* Large Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[550px] md:w-[650px] h-[700px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md">
            <span className="font-bold">Clinic Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "max-w-[85%] bg-indigo-600 text-white shadow-md"
                      : "max-w-full w-full bg-white border border-slate-200 shadow-sm text-slate-800"
                  }`}
                >
                  {msg.parts.map(
                    (part, i) =>
                      part.type === "text" && (
                        <div
                          key={i}
                          className="prose prose-sm max-w-none prose-slate"
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              // We use 'props' directly to avoid the 'node' unused variable error
                              table: (props) => (
                                <div className="my-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                  <div className="overflow-x-auto">
                                    <table
                                      className="min-w-full divide-y divide-slate-200"
                                      {...props}
                                    />
                                  </div>
                                </div>
                              ),
                              th: (props) => (
                                <th
                                  className="bg-slate-50 px-3 py-2 text-left font-bold text-slate-600 uppercase text-[10px] tracking-wider"
                                  {...props}
                                />
                              ),
                              td: (props) => (
                                <td
                                  className="px-3 py-2 border-t border-slate-100 text-slate-700"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {part.content}
                          </ReactMarkdown>
                        </div>
                      ),
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your schedule..."
              className="flex-1 p-3 bg-slate-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
