import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { RoleSchema } from "./types/auth";

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

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
};

const forbiddenResponse = (request: NextRequest) => {
    if (isApiPath(request.nextUrl.pathname)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const requiredRoles = getRequiredRoles(pathname);

    if (!requiredRoles) {
        return NextResponse.next();
    }

    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return unauthorizedResponse(request);
    }

    const roleResult = RoleSchema.safeParse((session.user as { role?: unknown }).role);
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


