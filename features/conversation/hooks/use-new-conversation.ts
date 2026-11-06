"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createConversation } from "@/features/conversation/actions/conversation-action";

export function useNewConversation() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function create() {
        startTransition(async () => {
            const conversation = await createConversation();
            router.push(`/chat/${conversation.id}`);
        });
    }

    return { create, isPending };
}
