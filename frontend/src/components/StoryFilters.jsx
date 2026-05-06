import { Search } from "lucide-react";
import Button from "./Button";

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
}) => (
  <div className="glass-panel rounded-[30px] border border-[var(--border)] p-5">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
      <label className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search titles, authors, or domains"
          type="search"
          value={search}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3 xl:w-[520px]">
        <select
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          onChange={(event) => onDomainChange(event.target.value)}
          value={domain}
        >
          <option value="">All domains</option>
          {availableDomains.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          onChange={(event) => onSortChange(event.target.value)}
          value={sortBy}
        >
          <option value="points">Sort by points</option>
          <option value="recent">Sort by freshness</option>
          <option value="comments">Sort by comments</option>
          <option value="title">Sort alphabetically</option>
        </select>

        <select
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          onChange={(event) => onOrderChange(event.target.value)}
          value={order}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--text-secondary)]">
        Search across headlines, authors, and domains without losing the bookmark
        context.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onClear} variant="ghost">
          Clear filters
        </Button>
        <Button onClick={onRefresh} variant="secondary">
          {refreshing ? "Refreshing…" : "Run scraper"}
        </Button>
      </div>
    </div>
  </div>
);

export default StoryFilters;
