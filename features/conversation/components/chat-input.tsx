"use client";

import { useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

type Props = {
    onSend: (message: string) => void;
    isLoading: boolean;
    onStop?: () => void;
};

export function ChatInput({ onSend, isLoading, onStop }: Props) {
    const [input, setInput] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleSend() {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;
        setInput("");
        // Reset textarea height
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        onSend(trimmed);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInput(e.target.value);
        // Auto-resize
        const el = e.target;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }

    return (
        <div className="border-t bg-background px-4 py-4">
            <div className="mx-auto max-w-3xl">
                <div className="relative flex items-end gap-2 rounded-2xl border bg-muted/40 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Message ChaiGPT..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground max-h-[200px] overflow-y-auto"
                    />
                    {isLoading ? (
                        <Button
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full"
                            onClick={onStop}
                        >
                            <Square className="h-3.5 w-3.5 fill-current" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            className={cn(
                                "h-8 w-8 shrink-0 rounded-full transition-opacity",
                                !input.trim() && "opacity-40"
                            )}
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    ChaiGPT can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
}
