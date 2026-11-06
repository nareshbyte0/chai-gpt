"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { updateConversationTitle } from "@/features/conversation/actions/conversation-action";

type Message = {
    id: string;
    role: string;
    content: string;
    createdAt: Date;
};

type Props = {
    conversationId: string;
    initialMessages: Message[];
    conversationTitle: string;
};

export function ChatView({ conversationId, initialMessages, conversationTitle }: Props) {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [streamingContent, setStreamingContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const handleSend = useCallback(
        async (content: string) => {
            if (isLoading) return;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content,
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);
            setStreamingContent("");

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        conversationId,
                        messages: [
                            ...messages.map((m) => ({
                                role: m.role,
                                content: m.content,
                            })),
                            { role: "user", content },
                        ],
                    }),
                    signal: controller.signal,
                });

                if (!res.ok || !res.body) {
                    throw new Error("Failed to get response");
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let accumulated = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    accumulated += decoder.decode(value, { stream: true });
                    setStreamingContent(accumulated);
                }

                // Add final assistant message to list
                const assistantMessage: Message = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: accumulated,
                    createdAt: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingContent("");

                // Auto-title: if first user message and title is still default
                if (
                    initialMessages.length === 0 &&
                    conversationTitle === "New chat"
                ) {
                    const title = content.slice(0, 50);
                    await updateConversationTitle(conversationId, title);
                    router.refresh();
                }
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Chat error:", err);
                }
            } finally {
                setIsLoading(false);
                setStreamingContent("");
                abortRef.current = null;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [conversationId, isLoading, messages]
    );

    function handleStop() {
        abortRef.current?.abort();
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center border-b px-6 py-3">
                <h2 className="truncate text-sm font-medium">
                    {conversationTitle}
                </h2>
            </div>

            <MessageList
                messages={messages}
                isLoading={isLoading}
                streamingContent={streamingContent}
            />
            <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                onStop={handleStop}
            />
        </div>
    );
}
