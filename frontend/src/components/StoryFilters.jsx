import { Search, SlidersHorizontal } from "lucide-react";
import Button from "./Button";
import CustomSelect from "./CustomSelect";

const StoryFilters = ({
  availableDomains,
  domain,
  onClear,
  onDomainChange,
  onOrderChange,
  onRefresh,
  onSearchChange,
  onSortChange,
  order,
  refreshing,
  search,
  sortBy,
}) => {
  const domainOptions = [
    { label: "All domains", value: "" },
    ...availableDomains.map((option) => ({ label: option, value: option })),
  ];

  const sortOptions = [
    { label: "Sort by points", value: "points" },
    { label: "Sort by freshness", value: "recent" },
    { label: "Sort by comments", value: "comments" },
    { label: "Sort alphabetically", value: "title" },
  ];

  const orderOptions = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
  ];

  return (
    <div className="glass-panel rounded-[28px] border border-[var(--border)] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:p-5">
      <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter stories
      </div>

      <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="w-full rounded-2xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),var(--panel))] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search titles, authors, or domains"
            type="search"
            value={search}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-[540px]">
          <CustomSelect
            onChange={onDomainChange}
            options={domainOptions}
            value={domain}
          />
          <CustomSelect
            onChange={onSortChange}
            options={sortOptions}
            value={sortBy}
          />
          <CustomSelect
            onChange={onOrderChange}
            options={orderOptions}
            value={order}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">
          Search across headlines, authors, and domains without losing the bookmark
          context.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onClear} size="sm" variant="ghost">
            Clear filters
          </Button>
          <Button onClick={onRefresh} size="sm" variant="secondary">
            {refreshing ? "Refreshing..." : "Run scraper"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryFilters;
