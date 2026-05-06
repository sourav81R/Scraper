import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";

const NotFound = () => (
  <PageTransition className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <div className="glass-panel max-w-2xl rounded-[36px] border border-[var(--border)] p-8 text-center sm:p-10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
        <Compass className="h-6 w-6" />
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
        Page not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
        This route does not exist in the tracker.
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
        The page you tried to open is missing, but the live story feed is only a
        click away.
      </p>
      <div className="mt-8 flex justify-center">
        <Button as={Link} to="/stories">
          Go to stories
        </Button>
      </div>
    </div>
  </PageTransition>
);

export default NotFound;
