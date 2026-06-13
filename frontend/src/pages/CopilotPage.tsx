import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { sendMessage } from "../services/copilot";
import { getApiErrorMessage } from "../services/apiClient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "What are my biggest cost drivers?",
  "How can I reduce my AWS bill?",
  "Explain my health score",
  "Show idle resources",
];

export function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your CloudWise Copilot. Ask me anything about your AWS costs, resources, or optimization opportunities.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isLoading) return;

    // Optimistically add user message
    const userMsg: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage({ message: messageText });

      // Store conversation ID from first response
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.response },
      ]);
    } catch (err) {
      // Display the error as an assistant message instead of crashing
      const errorText = getApiErrorMessage(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, something went wrong: ${errorText}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-[var(--color-surface)] pb-4">
        <MessageSquare className="w-6 h-6 text-(--color-accent)" />
        <h2 className="mb-0">AI Copilot</h2>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-[fadeIn_0.3s_ease]`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-(--color-accent) text-white"
                  : "bg-(--color-surface)"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start animate-[fadeIn_0.3s_ease]">
            <div className="bg-(--color-surface) p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-(--color-accent)" />
              <span className="text-sm text-(--color-text-secondary)">
                Thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Starter chips (only show when just the greeting exists) */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105"
              style={{
                borderColor: "var(--color-accent)",
                color: "var(--color-accent-hover)",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
              }}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          className="input-field flex-1"
          placeholder="Ask a question about your cloud costs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button
          onClick={() => handleSend()}
          isLoading={isLoading}
          className="px-4 py-2 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
