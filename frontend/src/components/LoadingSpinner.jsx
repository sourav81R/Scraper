const LoadingSpinner = ({ label = "Loading" }) => (
  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent)]" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
