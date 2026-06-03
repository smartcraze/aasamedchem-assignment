import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { RoleSchema } from "./types/auth";

const SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "aasa-medchem-super-secret-jwt-key-32chars-minimum"
);

const COOKIE_NAME = "auth-token";

type Role = "ADMIN" | "SELLER" | "BUYER";

const roleRules: Array<{ prefix: string; roles: Role[] }> = [
    { prefix: "/admin", roles: ["ADMIN"] },
    { prefix: "/seller", roles: ["SELLER", "ADMIN"] },
    { prefix: "/buyer", roles: ["BUYER", "ADMIN"] },
    { prefix: "/api/admin", roles: ["ADMIN"] },
    { prefix: "/api/seller", roles: ["SELLER", "ADMIN"] },
    { prefix: "/api/buyer", roles: ["BUYER", "ADMIN"] },
];


const isApiPath = (pathname: string) => pathname.startsWith("/api/");

const getRequiredRoles = (pathname: string) =>
    roleRules.find((rule) => pathname.startsWith(rule.prefix))?.roles;

const unauthorizedResponse = (request: NextRequest) => {
    if (isApiPath(request.nextUrl.pathname)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
};

const forbiddenResponse = (request: NextRequest) => {
    if (isApiPath(request.nextUrl.pathname)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", request.url));
};


export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requiredRoles = getRequiredRoles(pathname);

    if (!requiredRoles) {
        return NextResponse.next();
    }

    // Read and verify the JWT cookie directly (Edge-safe)
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
        return unauthorizedResponse(request);
    }

    let payload: { id?: string; role?: string } | null = null;
    try {
        const verified = await jwtVerify(token, SECRET);
        payload = verified.payload as { id?: string; role?: string };
    } catch {
        // Expired or tampered token
        return unauthorizedResponse(request);
    }

    const roleResult = RoleSchema.safeParse(payload?.role);
    if (!roleResult.success) {
        return forbiddenResponse(request);
    }

    if (!requiredRoles.includes(roleResult.data)) {
        return forbiddenResponse(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/seller/:path*",
        "/buyer/:path*",
        "/api/admin/:path*",
        "/api/seller/:path*",
        "/api/buyer/:path*",
    ],
};
