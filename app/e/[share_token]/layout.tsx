import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function EventPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
        <div className="flex w-full max-w-2xl items-center justify-between px-5 text-sm">
          <Link href="/" className="text-base font-bold">
            모임링크
          </Link>
          <ThemeSwitcher />
        </div>
      </nav>

      <div className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        {children}
      </div>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        © 2025 모임링크
      </footer>
    </main>
  );
}
