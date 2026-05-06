import { forwardRef } from "react";
import { cn } from "../lib/utils";

const variants = {
  primary:
    "bg-[var(--accent)] text-slate-950 shadow-[0_12px_40px_rgba(99,102,241,0.28)] hover:brightness-105",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--panel)] text-[var(--text-primary)] hover:bg-[var(--panel-strong)]",
  ghost:
    "text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]",
  subtle:
    "border border-white/10 bg-white/8 text-[var(--text-primary)] hover:bg-white/12",
};

const sizes = {
  sm: "h-10 rounded-full px-4 text-sm",
  md: "h-11 rounded-full px-5 text-sm",
  lg: "h-12 rounded-full px-6 text-sm",
};

const Button = forwardRef(
  (
    { children, className, size = "md", type = "button", variant = "primary", ...props },
    ref
  ) => (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
