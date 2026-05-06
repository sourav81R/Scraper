import { cn } from "../lib/utils";

const FormField = ({
  className,
  error,
  id,
  label,
  rightElement,
  ...props
}) => (
  <label className={cn("block space-y-2", className)} htmlFor={id}>
    <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
    <div className="relative">
      <input
        className={cn(
          "w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-[var(--text-primary)] shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
          rightElement ? "pr-12" : ""
        )}
        id={id}
        {...props}
      />
      {rightElement ? (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightElement}
        </div>
      ) : null}
    </div>
    {error ? <p className="text-sm text-rose-400">{error}</p> : null}
  </label>
);

export default FormField;
