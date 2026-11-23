"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/providers";
import { AuthButton } from "@/components/site/AuthButton";
import { BookIcon, BoltIcon, GlossaryIcon, HomeIcon, UserIcon } from "@/components/ui/icons";
import { useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/cn";

function useNavItems() {
  const { locale, t } = useApp();
  return [
    { href: `/${locale}`, label: t.nav.home, icon: HomeIcon, exact: true },
    { href: `/${locale}/learn`, label: t.nav.course, icon: BookIcon },
    { href: `/${locale}/glossary`, label: t.nav.glossary, icon: GlossaryIcon },
    { href: `/${locale}/profile`, label: t.nav.profile, icon: UserIcon },
  ];
}

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function Logo() {
  const { locale, t } = useApp();
  return (
    <Link href={`/${locale}`} className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3 30 27H2z" fill="var(--accent)" />
        <path d="M16 11 23.5 24h-15z" fill="var(--bg)" />
      </svg>
      <span>{t.siteName}</span>
    </Link>
  );
}

export function XpPill() {
  const { xp } = useProgress();
  const { t } = useApp();
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm font-bold shadow-raised"
      aria-label={`${xp} ${t.common.xp}`}
    >
      <BoltIcon size={16} className="text-accent" />
      <span className="tabular-nums">{xp}</span>
      <span className="text-muted">{t.common.xp}</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const items = useNavItems();
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map(item => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                      active ? "bg-surface text-accent shadow-raised" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <XpPill />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items = useNavItems();
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/60 bg-bg/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(item => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <Icon size={22} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
