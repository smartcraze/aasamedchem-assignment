import type { Metadata } from "next";
import { Suspense } from "react";
import SignInForm from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your AasaMedChem account to manage inventory, quotations, and orders.",
};

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInForm />
        </Suspense>
    );
}
