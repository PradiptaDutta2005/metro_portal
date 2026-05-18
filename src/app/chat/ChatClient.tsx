"use client";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Train, X } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatbotWidgetClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi, this is MetroSaathi! How can I assist you today?",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: input },
    ];

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: { response?: string } = await res.json();

      setMessages([
        ...newMessages,
        { sender: "bot", text: data.response || "⚠️ No response from bot" },
      ]);
      setInput("");
    } catch (err) {
      console.error("Chatbot fetch error:", err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Unable to connect to chatbot backend." },
      ]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      void sendMessage();
    }
  };

  return (
    <div className="z-50">
      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl"
        aria-label="Open chat"
      >
        <Train className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col h-[550px] border border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                <Train className="w-5 h-5" /> MetroSaathi Assistant
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
              {messages.map((msg, idx) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={idx}
                  className={`px-3 py-2 rounded-2xl max-w-[75%] break-words shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white self-end ml-auto"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t bg-white rounded-b-2xl">
              <input
                type="text"
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask me about metro services..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={() => void sendMessage()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
