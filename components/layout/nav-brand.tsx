import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function NavBrand() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2 font-serif text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
        >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:rotate-6">
                <FlaskConical className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">AasaMedChem</span>
        </Link>
    );
}
