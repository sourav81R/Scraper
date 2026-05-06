import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";

const CustomSelect = ({
  className,
  onChange,
  options,
  value,
}) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState("bottom");

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const updatePlacement = () => {
      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const estimatedMenuHeight = Math.min(options.length * 46 + 16, 304);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setMenuPlacement(
        spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
          ? "top"
          : "bottom"
      );
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open, options.length]);

  return (
    <div
      className={cn("relative", open ? "z-50" : "z-10", className)}
      ref={containerRef}
    >
      <button
        aria-expanded={open}
        className={cn(
          "inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),var(--panel))] px-4 py-3 text-left text-sm text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition hover:border-[var(--border-strong)] hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute left-0 right-0 z-[60] overflow-hidden rounded-[22px] border border-[var(--border-strong)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(246,249,255,0.94))] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl",
            menuPlacement === "top"
              ? "bottom-[calc(100%+0.55rem)]"
              : "top-[calc(100%+0.55rem)]"
          )}
        >
          <div className="max-h-72 overflow-y-auto pr-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition",
                    isSelected
                      ? "bg-[linear-gradient(135deg,var(--accent),#7c84ff)] text-white shadow-[0_10px_24px_rgba(99,102,241,0.28)]"
                      : "text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                  )}
                  key={option.value || option.label}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
