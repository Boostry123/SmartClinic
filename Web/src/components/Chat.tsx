/* --- React Hooks & Libraries --- */
import React, { useState, useRef, useEffect } from "react";
import { Send, X, Loader2 } from "lucide-react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* --- Local Components & Stores --- */
import { useAuthStore } from "../store/authStore";
import DoctorIcon from "./Icons/DoctorIcon";

const API_URL = import.meta.env.VITE_API_URL;

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { accessToken, user } = useAuthStore();

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents(`${API_URL}/chatbot`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* --- Chat Window (Conditional Rendering) --- */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[450px] h-[650px] max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col border border-slate-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DoctorIcon size={24} />
              <span className="font-bold">Clinic Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
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
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white max-w-[85%]"
                      : "bg-white border border-slate-200 text-slate-800 w-full"
                  }`}
                >
                  {msg.parts.map(
                    (p, i) =>
                      p.type === "text" && (
                        <div key={i} className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {p.content}
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
            className="p-3 bg-white border-t flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-slate-100 rounded border border-slate-200 outline-none text-sm focus:border-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 text-white rounded disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}

      {/* --- Simple Toggle Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center border-2 border-indigo-600 bg-indigo-50 overflow-hidden active:bg-slate-50"
      >
        {isOpen ? (
          <X size={32} className="text-indigo-600" />
        ) : (
          <DoctorIcon size={48} />
        )}
      </button>
    </div>
  );
};

export default Chat;
