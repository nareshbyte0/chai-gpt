"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteConversation as deleteConversationAction } from "@/features/conversation/actions/conversation-action";

export function useDeleteConversation() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function deleteConversation(id: string) {
        startTransition(async () => {
            await deleteConversationAction(id);
            router.push("/");
            router.refresh();
        });
    }

    return { deleteConversation, isPending };
}
