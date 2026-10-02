"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, primaryCta } from "@/config/nav";
import { NavLinks } from "./nav-links";
import { LogoMark } from "./logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-ink-foreground hover:bg-ink-surface hover:text-ink-foreground aria-expanded:bg-ink-surface aria-expanded:text-ink-foreground md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm [&>[data-slot=sheet-close]]:top-4.5">
        <div className="flex h-16 items-center gap-2.5 border-b px-4 font-semibold">
          <LogoMark tone="light" />
          <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
        </div>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <nav aria-label="Mobile" className="flex flex-1 flex-col p-4">
          <NavLinks
            items={[{ label: "Home", href: "/" }, ...mainNav]}
            onNavigate={close}
            className="flex flex-col"
            linkClassName="flex min-h-12 items-center border-b text-lg"
          />
          <Button asChild variant="brand" size="lg" className="mt-8 w-full">
            <Link href={primaryCta.href} onClick={close}>
              {primaryCta.label}
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
