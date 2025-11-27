import { Badge } from "@/components/ui/badge";
import { LeaveStatus } from "@/types";

interface StatusBadgeProps {
  status: LeaveStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize status to uppercase for consistency
  const normalizedStatus = status.toUpperCase();
  
  const variants: Record<string, string> = {
    PENDING: "bg-pending text-pending-foreground",
    APPROVED: "bg-success text-success-foreground",
    REJECTED: "bg-destructive text-destructive-foreground",
  };

  return (
    <Badge className={variants[normalizedStatus] || "bg-muted text-muted-foreground"}>
      {status}
    </Badge>
  );
}
