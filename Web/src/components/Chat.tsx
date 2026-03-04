import React, { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, BotMessageSquare } from "lucide-react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { useAuthStore } from "../store/authStore";

const API_URL = import.meta.env.VITE_API_URL;

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const userData = useAuthStore((state) => state.user);
  const userName = userData
    ? `${userData.user_metadata.name} ${userData.user_metadata.last_name}`
    : "User";
  const isUserDoctor = true;

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents(`${API_URL}/chatbot`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(input.trim());
    setInput("");
  };
  return isUserDoctor ? (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold tracking-tight">
                Clinic Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-slate-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length < 1 && (
              <div className="text-center text-slate-500 mt-10">
                <p className="text-sm">
                  Hello! Dr {userName} I'm your clinic assistant.
                </p>
                <p className="text-xs">How can I help you today?</p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.parts.map((part, partIdx) => {
                    if (part.type === "thinking") {
                      return (
                        <div
                          key={partIdx}
                          className="text-slate-500 italic mb-1 text-xs"
                        >
                          💭 Thinking: {part.content}
                        </div>
                      );
                    }
                    if (part.type === "text") {
                      return <div key={partIdx}>{part.content}</div>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-indigo-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about appointments..."
              className="flex-1 p-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  ) : null;
};

export default Chat;
