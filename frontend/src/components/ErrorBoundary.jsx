import { AlertTriangle } from "lucide-react";
import { Component } from "react";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="glass-panel max-w-xl rounded-[32px] border border-[var(--border)] p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h1 className="mt-6 text-3xl font-semibold text-[var(--text-primary)]">
              Something unexpected happened
            </h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              The interface hit a rendering problem. Refresh the page to recover and
              keep exploring the story tracker.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => window.location.reload()}>Reload app</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
