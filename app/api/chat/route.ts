import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are ChaiGPT, a helpful, friendly, and knowledgeable AI assistant. 
You are concise yet thorough, and you format your responses clearly using markdown when appropriate.
Always be honest about your limitations.`;

type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { conversationId, messages } = body as {
            conversationId: string;
            messages: ChatMessage[];
        };

        if (!conversationId || !messages || !Array.isArray(messages)) {
            return new Response("Bad Request", { status: 400 });
        }

        // Verify conversation belongs to this user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const conversation = await prisma.conversation.findFirst({
            where: { id: conversationId, userId: user.id },
        });

        if (!conversation) {
            return new Response("Conversation not found", { status: 404 });
        }

        // Save the last user message to DB
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === "user") {
            await prisma.message.create({
                data: {
                    conversationId,
                    role: "user",
                    content: lastMessage.content,
                },
            });
        }

        // Stream the AI response
        const result = streamText({
            model: google("gemini-2.0-flash"),
            system: SYSTEM_PROMPT,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            async onFinish({ text }) {
                // Save assistant reply to DB
                await prisma.message.create({
                    data: {
                        conversationId,
                        role: "assistant",
                        content: text,
                    },
                });

                // Update conversation updatedAt
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() },
                });
            },
        });

        return result.toTextStreamResponse();
    } catch (err) {
        console.error("[API/chat] error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
