import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/prisma";

const SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "fallback-secret-change-in-production-32chars"
);

const COOKIE_NAME = "auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Token shape ─────────────────────────────────────────────────────────────

export interface SessionPayload {
    id: string;
    email: string;
    name: string;
    role: string;
}

// ─── Sign & verify ───────────────────────────────────────────────────────────

export async function signToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export async function setSessionCookie(payload: SessionPayload) {
    const token = await signToken(payload);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

// ─── Session getter ───────────────────────────────────────────────────────────

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

// ─── Full user from DB (for sensitive ops) ────────────────────────────────────

export async function getSessionUser() {
    const session = await getSession();
    if (!session) return null;
    return db.user.findUnique({
        where: { id: session.id },
        select: { id: true, email: true, name: true, role: true },
    });
}