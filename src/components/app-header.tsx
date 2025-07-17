"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Timer, BarChartBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Timer", icon: Timer },
    { href: "/dashboard", label: "Dashboard", icon: BarChartBig },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold">VerdantFocus</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4 mr-2" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
