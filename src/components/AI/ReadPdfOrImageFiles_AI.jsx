import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { supabase } from "../../db/supabaseclient";

const getBaseUrl = () =>
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

const formatMultiPartText = (text = "") =>
  String(text)
    .replace(/\s+(?=\(?[a-e]\)\s)/gi, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const ReadPdfOrImageFiles_AI = ({ fileURL, className, currentPage }) => {
  const profile_picture = useSelector(
    (state) => state.personDetail.profile_pic
  );

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! Upload a PDF or image and I'll help you.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessage = {
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedHistory = [...messages, newMessage];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const activeImageUrl = Array.isArray(fileURL)
        ? fileURL[currentPage] || null
        : fileURL || null;

      const historyPayload = updatedHistory.slice(-10).map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        text: m.text,
      }));

      const res = await axios.post(
        `${getBaseUrl()}/ai/chat-file`,
        {
          prompt: userText,
          history: historyPayload,
          imageUrl: activeImageUrl,
        },
        {
          withCredentials: true,
          headers: session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {},
        }
      );

      const formattedReply = formatMultiPartText(
        res.data?.reply || res.data?.message || res.data?.question || ""
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            formattedReply ||
            "Sorry, I couldn't generate a response for that.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error?.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, something went wrong while processing your request.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        className,
        "flex flex-col rounded-lg border min-w-[400px] w-[500px] min-h-[500px] h-full bg-white shadow"
      )}
    >
      {/* Header */}
      <div className="p-3 border-b font-semibold text-gray-800 bg-gray-50 flex flex-row gap-2">
        <Avatar>
          <AvatarImage src="/dog_still.png" alt="dog" />
          <AvatarFallback>DG</AvatarFallback>
        </Avatar>
        <div className="my-auto">AI Assistant</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "ai" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/dog_still.png" alt="ai" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}

            <div className="flex flex-col w-fit max-w-[78%]">
              <div
                className={cn(
                  "px-3 py-2 rounded-lg text-sm whitespace-pre-line break-words",
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                )}
              >
                {msg.text}
              </div>
              <div
                className={cn(
                  "text-xs mt-1",
                  msg.role === "user"
                    ? "text-right text-gray-400"
                    : "text-left text-gray-500"
                )}
              >
                {msg.time}
              </div>
            </div>

            {msg.role === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile_picture} alt="user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-xs text-gray-400 italic">Thinking...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center gap-2 w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 w-full min-w-[300px]"
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button className="min-w-[60px]" onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ReadPdfOrImageFiles_AI;