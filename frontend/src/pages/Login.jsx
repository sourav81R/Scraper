import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [googleStatusLoading, setGoogleStatusLoading] = useState(true);

  useEffect(() => {
    const fetchGoogleStatus = async () => {
      try {
        const { data } = await api.get("/api/auth/google/status");
        setIsGoogleConfigured(Boolean(data.data?.configured));
      } catch (requestError) {
        setIsGoogleConfigured(false);
      } finally {
        setGoogleStatusLoading(false);
      }
    };

    fetchGoogleStatus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const { data } = await api.post("/api/auth/login", formData);
      login(data.token, data.user);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to log in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleConfigured) {
      setError(
        "Google sign-in is not configured on the server yet. Add FIREBASE_PROJECT_ID to the backend environment first."
      );
      return;
    }

    try {
      setGoogleSubmitting(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post("/api/auth/google", { idToken });

      login(data.token, data.user);
      navigate("/");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to continue with Google"
      );
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Log in to manage bookmarks</h1>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={formData.email}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          minLength="6"
          name="password"
          onChange={handleChange}
          required
          type="password"
          value={formData.password}
        />
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? "Logging in..." : "Login"}
        </button>
        <div className="auth-divider">
          <span>or</span>
        </div>
        <button
          className="google-button"
          disabled={googleSubmitting || googleStatusLoading || !isGoogleConfigured}
          onClick={handleGoogleSignIn}
          type="button"
        >
          {googleStatusLoading
            ? "Checking Google sign-in..."
            : googleSubmitting
              ? "Connecting..."
              : isGoogleConfigured
                ? "Continue with Google"
                : "Google sign-in unavailable"}
        </button>
        <p className="form-copy">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
