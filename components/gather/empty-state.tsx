import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

// 데이터가 없을 때 표시하는 빈 상태 컴포넌트
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon size={48} className="text-muted-foreground" />
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button asChild variant="outline">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
