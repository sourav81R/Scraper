import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        <p className="form-copy">
          Need an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
