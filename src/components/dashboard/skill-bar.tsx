export function SkillBar({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{name}</span>
        <span className="font-mono text-xs font-semibold text-muted">
          {value}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-deep">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 12px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
