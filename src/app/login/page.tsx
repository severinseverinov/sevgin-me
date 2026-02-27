"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{ width: "100%", maxWidth: "450px", padding: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Admin Portal
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
            Login to manage your portfolio
          </p>
        </div>

        <form
          className="admin-form"
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
        >
          <div className="admin-form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@sevginserbest.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          <div className="admin-form-field" style={{ marginTop: "1rem" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>

          {error && (
            <div className="admin-form-error" style={{ marginTop: "1.5rem" }}>
              <p>{error}</p>
            </div>
          )}

          <div style={{ marginTop: "2.5rem" }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
