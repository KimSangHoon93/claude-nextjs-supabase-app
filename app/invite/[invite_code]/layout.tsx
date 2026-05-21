export default function InviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      {children}
    </main>
  );
}
