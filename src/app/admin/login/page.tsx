import { redirect } from "next/navigation";
import { LogoMark } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/auth/dal";
import { isAuthConfigured } from "@/lib/env.server";

export const metadata = { title: "Sign in" };

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <LogoMark tone="light" className="size-10 text-foreground" />
          <div>
            <p className="font-semibold tracking-tight">Mithila Web Labs</p>
            <p className="text-sm text-muted-foreground">Admin</p>
          </div>
        </div>
        <div className="card-elevated mt-8 p-6 sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          {isAuthConfigured() ? (
            <LoginForm />
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              The database isn&apos;t configured on this server yet. See docs/local-development.md.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
