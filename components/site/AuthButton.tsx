"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useApp } from "@/components/providers";
import { useAuth } from "@/components/site/AuthProvider";
import { btn, cn } from "@/lib/cn";

export function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Header control: "Sign in" for guests, avatar menu when signed in. */
export function AuthButton() {
  const { t, locale } = useApp();
  const { user, ready, signIn, signOutUser, sync } = useAuth();

  if (!ready) return <span className="size-10" aria-hidden="true" />;

  if (!user) {
    return (
      <button type="button" onClick={signIn} className={cn(btn.base, btn.ghost, "min-h-10 rounded-full px-3 text-sm")}>
        <GoogleIcon />
        <span className="hidden sm:inline">{t.auth.signIn}</span>
        <span className="sm:hidden">{t.auth.signInShort}</span>
      </button>
    );
  }

  const initial = (user.displayName ?? user.email ?? "?").charAt(0).toUpperCase();
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-accent font-display text-sm font-bold text-on-accent shadow-raised"
          aria-label={`${t.auth.account}: ${user.displayName ?? user.email ?? ""}`}
        >
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element -- small remote avatar, no optimisation needed
            <img src={user.photoURL} alt="" width={40} height={40} referrerPolicy="no-referrer" className="size-full object-cover" />
          ) : (
            initial
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-64 rounded-2xl border border-line bg-surface-2 p-4 shadow-raised outline-none"
        >
          <p className="truncate font-bold">{user.displayName}</p>
          <p className="truncate text-sm text-muted">{user.email}</p>
          <p className="mt-2 text-xs text-muted">{t.auth.sync[sync]}</p>
          <div className="mt-4 grid gap-2">
            <Popover.Close asChild>
              <Link href={`/${locale}/profile`} className={cn(btn.base, btn.ghost, "min-h-10 text-sm")}>
                {t.nav.profile}
              </Link>
            </Popover.Close>
            <button type="button" onClick={signOutUser} className={cn(btn.base, btn.subtle, "min-h-10 text-sm")}>
              {t.auth.signOut}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Larger sign-in card for the profile page. */
export function AccountCard() {
  const { t } = useApp();
  const { user, ready, signIn, sync } = useAuth();
  if (!ready) return null;

  if (!user) {
    return (
      <div className="card glow mt-6 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-display font-semibold">{t.auth.cardTitle}</p>
          <p className="mt-1 text-sm text-muted">{t.auth.cardText}</p>
        </div>
        <button type="button" onClick={signIn} className={cn(btn.base, btn.primary, "shrink-0")}>
          <span className="grid size-6 place-items-center rounded-full bg-white">
            <GoogleIcon size={16} />
          </span>
          {t.auth.signInGoogle}
        </button>
      </div>
    );
  }

  return (
    <div className="card mt-6 flex items-center gap-4 p-5">
      {user.photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element -- small remote avatar
        <img src={user.photoURL} alt="" width={48} height={48} referrerPolicy="no-referrer" className="size-12 rounded-full" />
      ) : null}
      <div className="min-w-0">
        <p className="truncate font-bold">{user.displayName}</p>
        <p className="truncate text-sm text-muted">{user.email}</p>
        <p className={cn("mt-1 text-xs", sync === "error" ? "text-danger" : "text-muted")}>{t.auth.sync[sync]}</p>
      </div>
    </div>
  );
}
