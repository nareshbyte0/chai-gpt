import { Suspense } from "react";
import { onBoardCurrentUser } from "@/features/auth/action/onboard";

async function AuthSync() {
    await onBoardCurrentUser();
    return null;
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={null}>
                <AuthSync />
            </Suspense>
            {children}
        </>
    );
}
