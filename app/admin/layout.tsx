// /admin/login 등 인증 불필요한 경로를 위한 최소 래퍼
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
