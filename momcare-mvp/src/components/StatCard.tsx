interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string;
  status: string;
  statusColor: "accent" | "warn" | "danger" | "muted";
  onClick?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  accent: "text-accent",
  warn: "text-warn",
  danger: "text-danger",
  muted: "text-muted",
};

export default function StatCard({
  icon,
  iconColor,
  label,
  value,
  status,
  statusColor,
  onClick,
}: StatCardProps) {
  return (
    <div
      className="bg-card rounded-2xl p-5 shadow-sm card-hover border border-border cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-symbols-outlined mso text-2xl ${iconColor}`}>
          {icon}
        </span>
        <span className="text-sm font-semibold text-muted">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold ${iconColor}`}>{value}</p>
      <p className={`text-sm mt-1 ${STATUS_STYLES[statusColor]}`}>{status}</p>
    </div>
  );
}
