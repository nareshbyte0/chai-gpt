import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center p-8">
                    <Spinner className="size-8 text-muted-foreground" />
                </div>
            }
        >
            <SignIn forceRedirectUrl="/" />
        </Suspense>
    );
}
