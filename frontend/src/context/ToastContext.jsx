import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../lib/utils";

const ToastContext = createContext(null);

const toastIcons = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

const toastStyles = {
  success:
    "border-emerald-300/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(236,253,245,0.96))] text-emerald-950",
  error:
    "border-rose-300/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,241,242,0.98))] text-rose-950",
  info:
    "border-sky-300/40 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(240,249,255,0.98))] text-sky-950",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  };

  const pushToast = ({ title, description, variant = "info" }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant },
    ]);

    window.setTimeout(() => removeToast(id), 3600);
  };

  const value = useMemo(
    () => ({
      pushToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] mx-auto flex w-full max-w-6xl justify-end px-4">
        <div className="pointer-events-auto flex w-full max-w-md flex-col gap-3">
          <AnimatePresence>
            {toasts.map((toast) => {
              const Icon = toastIcons[toast.variant] || Info;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "glass-panel relative flex items-start gap-3 overflow-hidden rounded-[24px] border px-4 py-3.5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl",
                    toastStyles[toast.variant]
                  )}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  initial={{ opacity: 0, y: -18, scale: 0.96 }}
                  key={toast.id}
                  layout
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_32%)]" />
                  <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-current/10 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="relative min-w-0 flex-1">
                    <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-6 text-current/72">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    aria-label="Dismiss notification"
                    className="relative rounded-full border border-current/10 bg-white/60 p-1.5 text-current/70 transition hover:-translate-y-0.5 hover:bg-white/80 hover:text-current"
                    onClick={() => removeToast(toast.id)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
