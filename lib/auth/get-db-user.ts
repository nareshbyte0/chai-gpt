import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { syncUserFromClerk } from "@/features/auth/action/sync-user";

export async function getDbUser() {
    const clerkUser = await currentUser();

    if (!clerkUser) {
        throw new Error("Unauthorized: Please sign in to continue.");
    }

    let user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });

    if (!user) {
        user = await syncUserFromClerk(clerkUser);
    }

    return user;
}

