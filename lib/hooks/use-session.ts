/**
 * Re-export from the session provider so components import from a single path.
 *
 * @example
 * import { useSession } from "@/lib/hooks/use-session";
 *
 * const { session, status, signOut } = useSession();
 */
export { useSession } from "@/components/providers/session-provider";
export type { SessionContextValue, SessionStatus } from "@/components/providers/session-provider";
