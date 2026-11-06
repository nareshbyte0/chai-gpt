"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SquarePen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/features/conversation/components/conversation-list";
import { useNewConversation } from "@/features/conversation/hooks/use-new-conversation";
import { Separator } from "@/components/ui/separator";

type Conversation = {
    id: string;
    title: string;
    updatedAt: Date;
};

type Props = {
    conversations: Conversation[];
};

export function AppSidebar({ conversations }: Props) {
    const { create, isPending } = useNewConversation();

    return (
        <aside className="flex h-full w-64 flex-col border-r bg-sidebar">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base font-semibold tracking-tight">ChaiGPT</span>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={create}
                    disabled={isPending}
                    title="New chat"
                >
                    <SquarePen className="h-4 w-4" />
                </Button>
            </div>

            <Separator />

            {/* Conversation list */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <p className="mb-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Conversations
                </p>
                <ConversationList conversations={conversations} />
            </nav>

            <Separator />

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3">
                <UserButton />
                <ModeToggle />
            </div>
        </aside>
    );
}
