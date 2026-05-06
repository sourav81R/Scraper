import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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

      const { data } = await api.post("/api/auth/register", formData);
      login(data.token, data.user);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create an account</p>
        <h1>Save the stories worth revisiting</h1>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          onChange={handleChange}
          required
          type="text"
          value={formData.name}
        />
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
          {submitting ? "Creating account..." : "Register"}
        </button>
        <p className="form-copy">
          Already registered? <Link to="/login">Log in here</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
