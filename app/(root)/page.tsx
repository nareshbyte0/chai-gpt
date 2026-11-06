import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                    Welcome to ChaiGPT ☕
                </h1>
                <p className="max-w-md text-muted-foreground text-lg">
                    Your AI-powered chat assistant. Start a new conversation or
                    pick up where you left off.
                </p>
            </div>
            <Button
                size="lg"
                className="gap-2"
                render={<Link href="/chat/new" />}
            >
                <MessageSquarePlus className="h-5 w-5" />
                New Chat
            </Button>
        </div>
    );
}
