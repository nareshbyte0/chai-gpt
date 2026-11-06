import { redirect } from "next/navigation";
import { createConversation } from "@/features/conversation/actions/conversation-action";

export default async function NewChatPage() {
    const conversation = await createConversation();
    redirect(`/chat/${conversation.id}`);
}
