export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-[14px] font-bold ${className}`}>
      {label}
      {children}
      {hint && <span className="text-[12px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

export const input = "field min-h-11 text-[14px] font-normal";
export const textarea = "field py-3 text-[14px] font-normal leading-[1.6]";
