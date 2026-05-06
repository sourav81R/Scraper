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
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  info: "border-sky-400/30 bg-sky-500/10 text-sky-100",
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
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] mx-auto flex w-full max-w-5xl justify-end px-4">
        <div className="pointer-events-auto flex w-full max-w-sm flex-col gap-3">
          <AnimatePresence>
            {toasts.map((toast) => {
              const Icon = toastIcons[toast.variant] || Info;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "glass-panel flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl",
                    toastStyles[toast.variant]
                  )}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  initial={{ opacity: 0, y: -18, scale: 0.96 }}
                  key={toast.id}
                  layout
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm text-current/80">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    aria-label="Dismiss notification"
                    className="rounded-full p-1 text-current/80 transition hover:bg-white/10 hover:text-current"
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
