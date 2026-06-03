import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),

    AUTH_SECRET: z
        .string()
        .min(32, "AUTH_SECRET must be at least 32 characters"),

    AUTH_URL: z.string().url(),

    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
    const missing = result.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n");
    console.warn(`[env] Missing or invalid environment variables:\n${missing}`);
}

export const env = (result.success ? result.data : process.env) as Env;