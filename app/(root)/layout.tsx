import { onBoardCurrentUser } from "@/features/auth/action/onboard";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await onBoardCurrentUser();

    return <>{children}</>;
}

