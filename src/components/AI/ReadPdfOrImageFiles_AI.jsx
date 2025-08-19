import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

const ReadPdfOrImageFiles_AI = ({ fileURL, className, currentPage }) => {
  const profile_picture = useSelector(
    (state) => state.personDetail.profile_pic
  );

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! Upload a PDF or image and I’ll help you.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  //   const pictureURL = fileURL ? fileURL[currentPage] : null;

  //   console.log(fileURL)

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    (async () => {
      try {
        // build conversation ...
        const conversation = [
          ...messages.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: [{ type: "text", text: m.text }],
          })),
          {
            role: "user",
            content: [
              { type: "text", text: newMessage.text },
              {
                type: "image_url",
                image_url: { url: fileURL[currentPage] },
              },
            ],
          },
        ];

        setLoading(true); // 🔥 mark AI as "typing"
        let aiMessage = {
          role: "ai",
          text: "...thinking...", // 🔥 placeholder
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, aiMessage]);

        const resp = await puter.ai.chat(conversation, {
          model: "gpt-5",
          stream: true,
        });

        for await (const part of resp) {
          if (part?.text) {
            aiMessage = {
              ...aiMessage,
              text:
                aiMessage.text === "...thinking..."
                  ? part.text
                  : aiMessage.text + part.text,
            };
            setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
          }
        }

        setLoading(false); // 🔥 done typing
      } catch (error) {
        console.error("AI chat error:", error);
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
        setLoading(false);
      }
    })();
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
            {/* Avatar */}
            {msg.role === "ai" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src="/dog_still.png" alt="ai" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}

            {/* Message bubble + time */}
            <div className="flex flex-col w-fit">
              <div
                className={cn(
                  "px-3 py-2 rounded-lg text-sm",
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

        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center gap-2 w-full">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 w-full min-w-[300px]"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button className="min-w-[60px]" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ReadPdfOrImageFiles_AI;
