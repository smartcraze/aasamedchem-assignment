"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const { status, refresh } = useSession();
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    // Already logged in — bounce to dashboard
    useEffect(() => {
        if (status === "authenticated") {
            router.replace(callbackUrl);
        }
    }, [status, callbackUrl, router]);

    if (status === "authenticated") {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            const toastId = toast.loading("Signing in…");

            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                toast.error("Sign in failed.", {
                    id: toastId,
                    description: data?.error ?? "Invalid email or password.",
                });
                return;
            }

            // Sync session context before navigating
            await refresh();

            toast.success("Welcome back!", {
                id: toastId,
                description: "Redirecting to your dashboard…",
            });

            router.push(callbackUrl);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your AasaMedChem account
                </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    Email address
                </Label>
                <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring"
                />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                        Password
                    </Label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                        tabIndex={-1}
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={isPending}
                        className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring pr-10"
                    />
                    <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <Button
                id="signin-submit"
                type="submit"
                disabled={isPending || !form.email || !form.password}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium gap-2"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in…
                    </>
                ) : (
                    <>
                        <LogIn className="h-4 w-4" />
                        Sign in
                    </>
                )}
            </Button>

            <div className="relative flex items-center gap-3 text-xs">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground shrink-0">Don&apos;t have an account?</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
                <Link
                    href="/sign-up"
                    id="goto-signup"
                    className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                >
                    Create an account →
                </Link>
            </p>
        </form>
    );
}
