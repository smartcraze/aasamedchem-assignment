"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Eye, EyeOff, Loader2, UserPlus, CheckCircle2, ShoppingCart, Package,
} from "lucide-react";

type Role = "BUYER" | "SELLER";

interface RoleOption { value: Role; label: string; description: string; icon: React.ReactNode; }

const ROLE_OPTIONS: RoleOption[] = [
    { value: "BUYER",  label: "Buyer",  description: "Browse products, place quotations & orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { value: "SELLER", label: "Seller", description: "Review, approve & manage orders",             icon: <Package       className="h-4 w-4" /> },
];

interface FormState { name: string; email: string; password: string; confirmPassword: string; role: Role; }

const passwordStrength = (pw: string): { level: number; label: string; color: string } => {
    if (!pw)       return { level: 0, label: "",          color: "" };
    if (pw.length < 8) return { level: 1, label: "Too short", color: "bg-destructive" };
    const score = [/[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
    if (score === 0) return { level: 2, label: "Weak",   color: "bg-destructive" };
    if (score === 1) return { level: 3, label: "Fair",   color: "bg-accent" };
    if (score === 2) return { level: 4, label: "Good",   color: "bg-primary" };
    return             { level: 5, label: "Strong", color: "bg-primary" };
};

export default function SignUpForm() {
    const router = useRouter();
    const { refresh } = useSession();
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "", role: "BUYER" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const strength      = passwordStrength(form.password);
    const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
    const isValid        =
        form.name.trim().length > 0 &&
        form.email.includes("@") &&
        form.password.length >= 8 &&
        passwordsMatch;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!passwordsMatch) {
            toast.error("Passwords do not match.", { description: "Make sure both fields are identical." });
            return;
        }

        startTransition(async () => {
            const toastId = toast.loading("Creating your account…");

            // 1. Register
            const registerRes = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: form.role }),
            });

            if (!registerRes.ok) {
                const data = await registerRes.json().catch(() => ({}));
                toast.error("Registration failed.", { id: toastId, description: data?.error ?? "Please try again." });
                return;
            }

            toast.loading("Almost there — signing you in…", { id: toastId });

            // 2. Auto sign-in
            const signInRes = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            if (!signInRes.ok) {
                toast.warning("Account created!", { id: toastId, description: "Please sign in with your new credentials." });
                router.push("/sign-in");
                return;
            }

            // Sync session context then navigate
            await refresh();

            toast.success(`Welcome, ${form.name}!`, { id: toastId, description: "Taking you to your dashboard…" });
            router.push("/dashboard");
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
                <p className="text-sm text-muted-foreground">Join AasaMedChem to start managing your orders</p>
            </div>

            {/* Role selector */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">I am a</Label>
                <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((option) => {
                        const isSelected = form.role === option.value;
                        return (
                            <button
                                key={option.value} type="button" id={`role-${option.value.toLowerCase()}`}
                                onClick={() => setForm((p) => ({ ...p, role: option.value }))}
                                className={["relative flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    isSelected ? "border-primary bg-secondary shadow-sm" : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50"
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={["flex items-center gap-1.5 text-sm font-medium", isSelected ? "text-primary" : "text-foreground"].join(" ")}>
                                        {option.icon}{option.label}
                                    </span>
                                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                                </div>
                                <p className="text-xs text-muted-foreground leading-snug">{option.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full name</Label>
                <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder="Jane Smith"
                    value={form.name} onChange={handleChange} required disabled={isPending}
                    className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email address</Label>
                <Input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange} required disabled={isPending}
                    className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring" />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                    <Input id="signup-password" name="password" type={showPassword ? "text" : "password"}
                        autoComplete="new-password" placeholder="Min. 8 characters"
                        value={form.password} onChange={handleChange} required disabled={isPending}
                        className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring pr-10" />
                    <button type="button" aria-label={showPassword ? "Hide" : "Show"} tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {form.password.length > 0 && (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map((seg) => (
                                <div key={seg} className={["h-1 flex-1 rounded-full transition-all duration-300",
                                    seg <= strength.level ? strength.color : "bg-border"].join(" ")} />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Strength: <span className={strength.level >= 4 ? "text-primary" : ""}>{strength.label}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-foreground">Confirm password</Label>
                    {form.confirmPassword.length > 0 && (
                        <Badge className={["text-xs px-1.5 py-0",
                            passwordsMatch ? "bg-secondary text-foreground border-border" : "bg-destructive/20 text-foreground border-destructive/30"
                        ].join(" ")}>
                            {passwordsMatch ? "✓ Match" : "✗ Mismatch"}
                        </Badge>
                    )}
                </div>
                <div className="relative">
                    <Input id="signup-confirm-password" name="confirmPassword" type={showConfirm ? "text" : "password"}
                        autoComplete="new-password" placeholder="Repeat your password"
                        value={form.confirmPassword} onChange={handleChange} required disabled={isPending}
                        className="bg-input border-border placeholder:text-muted-foreground focus-visible:ring-ring pr-10" />
                    <button type="button" aria-label={showConfirm ? "Hide" : "Show"} tabIndex={-1}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Submit */}
            <Button id="signup-submit" type="submit" disabled={isPending || !isValid}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium gap-2">
                {isPending ? (<><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>)
                           : (<><UserPlus className="h-4 w-4" />Create account</>)}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" id="goto-signin"
                    className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                    Sign in →
                </Link>
            </p>
        </form>
    );
}
