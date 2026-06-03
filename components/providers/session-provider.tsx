"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SessionPayload } from "@/lib/auth";


export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface SessionContextValue {
    /** The current session data, or null when signed out */
    session: SessionPayload | null;
    /** loading → authenticated → unauthenticated */
    status: SessionStatus;
    /** Re-fetch the session from the server (call after sign-in/sign-out) */
    refresh: () => Promise<void>;
    /** Sign the user out and redirect to /sign-in */
    signOut: (opts?: { callbackUrl?: string }) => Promise<void>;
}


const SessionContext = createContext<SessionContextValue | null>(null);


export function SessionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [session, setSession] = useState<SessionPayload | null>(null);
    const [status, setStatus] = useState<SessionStatus>("loading");
    const [, startTransition] = useTransition();

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/session", { cache: "no-store" });
            const data: SessionPayload | null = await res.json();
            setSession(data);
            setStatus(data ? "authenticated" : "unauthenticated");
        } catch {
            setSession(null);
            setStatus("unauthenticated");
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const signOut = useCallback(
        async ({ callbackUrl = "/sign-in" }: { callbackUrl?: string } = {}) => {
            startTransition(async () => {
                const toastId = toast.loading("Signing out…");

                await fetch("/api/auth/sign-out", { method: "POST" });

                setSession(null);
                setStatus("unauthenticated");

                toast.success("Signed out.", {
                    id: toastId,
                    description: "See you next time!",
                });

                router.push(callbackUrl);
                router.refresh();
            });
        },
        [router, startTransition]
    );

    return (
        <SessionContext.Provider value={{ session, status, refresh, signOut }}>
            {children}
        </SessionContext.Provider>
    );
}


/**
 * Access the current session anywhere in the client tree.
 *
 * @example
 * const { session, status, signOut } = useSession();
 */
export function useSession(): SessionContextValue {
    const ctx = useContext(SessionContext);
    if (!ctx) {
        throw new Error("useSession must be used inside <SessionProvider>");
    }
    return ctx;
}
