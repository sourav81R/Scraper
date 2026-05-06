const SkeletonCard = () => (
  <div className="glass-panel overflow-hidden rounded-[28px] border border-[var(--border)] p-5">
    <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
    <div className="mt-4 h-7 w-3/4 animate-pulse rounded-2xl bg-white/10" />
    <div className="mt-6 space-y-3">
      <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
      <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
      <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
    </div>
    <div className="mt-8 flex items-center justify-between">
      <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
      <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={`skeleton-${index}`} />
    ))}
  </div>
);

export default SkeletonGrid;
