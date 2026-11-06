import { notFound, redirect } from "next/navigation";
import { getConversation } from "@/features/conversation/actions/conversation-action";
import { ChatView } from "@/features/conversation/components/chat-view";

type Props = {
    params: Promise<{ conversationId: string }>;
};

export default async function ChatPage({ params }: Props) {
    const { conversationId } = await params;

    const conversation = await getConversation(conversationId);

    if (!conversation) {
        notFound();
    }

    return (
        <ChatView
            conversationId={conversation.id}
            initialMessages={conversation.messages}
            conversationTitle={conversation.title}
        />
    );
}
