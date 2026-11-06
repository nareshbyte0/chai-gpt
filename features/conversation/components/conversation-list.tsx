"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { useDeleteConversation } from "@/features/conversation/hooks/use-delete-conversation";

type Conversation = {
    id: string;
    title: string;
    updatedAt: Date;
};

type Props = {
    conversations: Conversation[];
};

export function ConversationList({ conversations }: Props) {
    const pathname = usePathname();
    const { deleteConversation, isPending } = useDeleteConversation();

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 opacity-40" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs opacity-60">Start a new chat to begin</p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-1">
            {conversations.map((conv) => {
                const isActive = pathname === `/chat/${conv.id}`;
                return (
                    <li key={conv.id} className="group relative">
                        <Link
                            href={`/chat/${conv.id}`}
                            className={cn(
                                "flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                                isActive && "bg-accent font-medium"
                            )}
                        >
                            <span className="truncate leading-snug">
                                {conv.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conv.updatedAt), {
                                    addSuffix: true,
                                })}
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteConversation(conv.id);
                            }}
                            disabled={isPending}
                            aria-label="Delete conversation"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
}
