import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShowcase from "../components/AuthShowcase";
import Button from "../components/Button";
import FormField from "../components/FormField";
import GoogleIcon from "../components/GoogleIcon";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { normalizeApiError } from "../lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleAvailable, googleStatusLoading, login, loginWithGoogle } = useAuth();
  const { pushToast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");

  const nextRoute = location.state?.from || "/stories";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await login(formData);
      pushToast({
        title: "Welcome back",
        description: "You are now signed in and ready to save stories.",
        variant: "success",
      });
      navigate(nextRoute, { replace: true });
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to sign in"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleSubmitting(true);
      setError("");
      await loginWithGoogle();
      pushToast({
        title: "Google sign-in complete",
        description: "Your session is ready.",
        variant: "success",
      });
      navigate(nextRoute, { replace: true });
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to continue with Google"));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <PageTransition className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[0.9fr_1fr]">
        <AuthShowcase
          caption="Sign in"
          title="Return to a focused feed of stories worth your attention."
        />

        <section className="glass-panel rounded-[34px] border border-[var(--border)] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[2.65rem]">
            Log in to manage bookmarks
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Pick up right where you left off with your saved reading queue.
          </p>

          <form className="mt-7 space-y-4.5" onSubmit={handleSubmit}>
            <FormField
              autoComplete="email"
              id="email"
              label="Email"
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="you@example.com"
              required
              type="email"
              value={formData.email}
            />
            <FormField
              autoComplete="current-password"
              id="password"
              label="Password"
              onChange={(event) =>
                setFormData((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Enter your password"
              required
              rightElement={
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              type={showPassword ? "text" : "password"}
              value={formData.password}
            />

            {error ? <p className="text-sm text-rose-400">{error}</p> : null}

            <Button className="w-full justify-center" size="lg" type="submit">
              <LogIn className="h-4 w-4" />
              {submitting ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Or
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <Button
              className="w-full justify-center border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,255,0.96))] shadow-[0_16px_40px_rgba(15,23,42,0.08)] hover:border-[var(--border-strong)] hover:bg-white"
              disabled={!googleAvailable || googleStatusLoading || googleSubmitting}
              onClick={handleGoogle}
              size="lg"
              type="button"
              variant="secondary"
            >
              <GoogleIcon className="h-[18px] w-[18px]" />
              {googleStatusLoading
                ? "Checking Google sign-in..."
                : googleSubmitting
                  ? "Connecting..."
                  : googleAvailable
                    ? "Continue with Google"
                    : "Google sign-in unavailable"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-[var(--text-secondary)]">
            Need an account?{" "}
            <Link className="font-medium text-[var(--accent)]" to="/register">
              Register here
            </Link>
          </p>
        </section>
      </div>
    </PageTransition>
  );
};

export default Login;
