import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShowcase from "../components/AuthShowcase";
import Button from "../components/Button";
import FormField from "../components/FormField";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { normalizeApiError } from "../lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const { googleAvailable, googleStatusLoading, loginWithGoogle, register } =
    useAuth();
  const { pushToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await register(formData);
      pushToast({
        title: "Account created",
        description: "Your story tracker workspace is ready.",
        variant: "success",
      });
      navigate("/stories", { replace: true });
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to create account"));
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
        title: "Signed up with Google",
        description: "Your account is ready to save stories.",
        variant: "success",
      });
      navigate("/stories", { replace: true });
    } catch (requestError) {
      setError(normalizeApiError(requestError, "Unable to continue with Google"));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <PageTransition className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <AuthShowcase
          caption="Create account"
          title="Save the stories you actually want to revisit, not just skim."
        />

        <section className="glass-panel rounded-[36px] border border-[var(--border)] p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Create account
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Build your own high-signal reading queue
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Create an account to bookmark standout links and keep your tracking flow
            across devices.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormField
              autoComplete="name"
              id="name"
              label="Name"
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Your name"
              required
              type="text"
              value={formData.name}
            />
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
              autoComplete="new-password"
              id="password"
              label="Password"
              onChange={(event) =>
                setFormData((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Choose a strong password"
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
              <Sparkles className="h-4 w-4" />
              {submitting ? "Creating account…" : "Register"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                Or
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <Button
              className="w-full justify-center"
              disabled={!googleAvailable || googleStatusLoading || googleSubmitting}
              onClick={handleGoogle}
              size="lg"
              type="button"
              variant="secondary"
            >
              {googleStatusLoading
                ? "Checking Google sign-in…"
                : googleSubmitting
                  ? "Connecting…"
                  : googleAvailable
                    ? "Continue with Google"
                    : "Google sign-in unavailable"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-[var(--text-secondary)]">
            Already registered?{" "}
            <Link className="font-medium text-[var(--accent)]" to="/login">
              Log in here
            </Link>
          </p>
        </section>
      </div>
    </PageTransition>
  );
};

export default Register;
