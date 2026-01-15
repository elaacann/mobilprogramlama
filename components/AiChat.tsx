
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export default function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Merhaba! Size nasıl yardımcı olabilirim? Araçlarımız veya şubelerimiz hakkında sorabilirsiniz.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-[500px] bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-full">
                                <Bot size={20} />
                            </div>
                            <span className="font-semibold">Asistan</span>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2 ring-1 ring-transparent focus-within:ring-blue-500 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Bir soru sorun..."
                                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className={`p-2 rounded-full ${isLoading || !input.trim()
                                    ? "text-gray-400"
                                    : "text-blue-600 hover:bg-blue-100"
                                    } transition-colors`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="text-[10px] text-center text-gray-400 mt-2">
                            AI tarafından oluşturulmuştur, hatalı olabilir.
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${isOpen
                    ? "bg-gray-800 text-white rotate-90 opacity-0 pointer-events-none h-0 w-0 p-0 overflow-hidden"
                    : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                    }`}
            >
                <MessageCircle size={28} />
            </button>

            {/* Re-entry button when open (optional, usually the X in header is enough, but a fixed button to close is also fine. 
          Here I hid the main button when open for a cleaner look, and relying on the X in the header to close.) 
      */}
        </div>
    );
}
