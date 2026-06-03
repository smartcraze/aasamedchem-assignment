import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
    title: "Create Account",
    description: "Register for an AasaMedChem account as a Buyer or Seller.",
};

export default function SignUpPage() {
    return <SignUpForm />;
}
