import type { Locale } from "@/lib/i18n";
import { signOutAction } from "@/actions/auth";

export function SignOutButton({
  locale,
  label,
  className = "rounded-md px-2.5 py-1.5 font-medium transition hover:bg-white hover:text-[var(--text)]",
}: {
  locale: Locale;
  label?: string;
  className?: string;
}) {
  const action = signOutAction.bind(null, locale);

  return (
    <form action={action}>
      <button type="submit" className={className}>
        {label ?? (locale === "en" ? "Sign out" : "退出登录")}
      </button>
    </form>
  );
}
