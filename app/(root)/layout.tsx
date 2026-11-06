import { Suspense } from "react";
import { onBoardCurrentUser } from "@/features/auth/action/onboard";
import { getConversations } from "@/features/conversation/actions/conversation-action";
import { AppSidebar } from "@/features/conversation/components/app-sidebar";

async function AuthSync() {
    await onBoardCurrentUser();
    return null;
}

async function SidebarData() {
    const conversations = await getConversations();
    return <AppSidebar conversations={conversations} />;
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Suspense fallback={null}>
                <AuthSync />
            </Suspense>
            <Suspense
                fallback={
                    <div className="w-64 border-r bg-sidebar animate-pulse" />
                }
            >
                <SidebarData />
            </Suspense>
            <main className="flex flex-1 flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}
