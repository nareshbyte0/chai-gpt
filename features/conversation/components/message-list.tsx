"use client";

import { useEffect, useRef } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "cn";

type Message = {
    id: string;
    role: string;
    content: string;
};

type Props = {
    messages: Message[];
    isLoading?: boolean;
    streamingContent?: string;
};

export function MessageList({ messages, isLoading, streamingContent }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingContent]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto max-w-3xl flex flex-col gap-6">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))}
                {isLoading && streamingContent !== undefined && (
                    <MessageBubble role="assistant" content={streamingContent} streaming />
                )}
                {isLoading && streamingContent === "" && (
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex gap-1 items-center">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

function MessageBubble({
    role,
    content,
    streaming,
}: {
    role: string;
    content: string;
    streaming?: boolean;
}) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex items-start gap-3",
                isUser && "flex-row-reverse"
            )}
        >
            <div
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full shrink-0",
                    isUser
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                )}
            >
                {isUser ? (
                    <User className="h-4 w-4" />
                ) : (
                    <Bot className="h-4 w-4" />
                )}
            </div>
            <div
                className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                )}
            >
                {content}
                {streaming && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />
                )}
            </div>
        </div>
    );
}
