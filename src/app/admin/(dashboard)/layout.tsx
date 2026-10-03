import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { LogoMark } from "@/components/layout/logo";
import { signOut } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/dal";

const nav = [
  { label: "Leads", href: "/admin" },
  { label: "AI demo runs", href: "/admin/demo-runs" },
];

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();

  return (
    <>
      <header className="border-b border-ink-border bg-ink text-ink-foreground">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 rounded-sm font-semibold">
              <LogoMark className="size-8" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <nav aria-label="Admin" className="flex gap-1 text-sm">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full px-3 py-1.5 text-ink-muted hover:bg-ink-surface hover:text-ink-foreground">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={signOut} className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-muted md:inline">{user.email}</span>
            <Button type="submit" variant="ghost" size="sm" className="text-ink-foreground hover:bg-ink-surface hover:text-ink-foreground">
              <LogOutIcon data-icon="inline-start" />
              Sign out
            </Button>
          </form>
        </Container>
      </header>
      <main className="flex-1">
        <Container className="py-8 sm:py-10">{children}</Container>
      </main>
    </>
  );
}
