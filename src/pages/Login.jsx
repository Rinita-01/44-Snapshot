import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("super@walletadmin.com");
  const [password, setPassword] = useState("Secure@123");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const passwordValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!passwordValid) {
      setError("Password must be 8+ chars with uppercase, number, and symbol.");
      return;
    }
    const result = login(email, password, remember);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleForgotSend = () => {
    if (!forgotEmail.trim()) {
      setError("Please enter an email to receive the OTP.");
      return;
    }
    setError("");
    setForgotSent(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-slate-900">
      <div className="pointer-events-none absolute -top-24 right-8 h-80 w-80 rounded-full bg-slate-900/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[28rem] w-[28rem] rounded-full bg-slate-900/5 blur-[130px]" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white p-1 shadow-sm">
              <img src="/logo.png" alt="44 Snapshot" className="h-full w-full rounded-xl object-contain" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-wide">44 Snapshot</div>
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Admin Console</div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Secure login</div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {forgotMode ? "Reset access with OTP" : "Sign in to the admin dashboard"}
            </h1>
            <p className="text-sm text-slate-500">
              {forgotMode
                ? "Enter your email and we’ll send a one-time OTP to verify your identity."
                : "Use your admin credentials to manage users, documents, and subscriptions."}
            </p>
          </div>

          {forgotMode ? (
            <div className="mt-6 grid gap-4">
              <label className="text-sm text-slate-600">
                Email address
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@44snapshot.com"
                  required
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                onClick={handleForgotSend}
              >
                Send OTP
              </button>

              <button
                type="button"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                onClick={() => {
                  setForgotMode(false);
                  setForgotSent(false);
                  setError("");
                }}
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <label className="text-sm text-slate-600">
                Email
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@44snapshot.com"
                  required
                />
              </label>
              <label className="text-sm text-slate-600">
                Password
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="**********"
                  required
                />
                <span className={passwordValid ? "text-xs text-emerald-600" : "text-xs text-amber-600"}>
                  Password must include uppercase, number, symbol.
                </span>
              </label>
              <label className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </span>
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-slate-900"
                  onClick={() => {
                    setForgotMode(true);
                    setForgotSent(false);
                    setError("");
                  }}
                >
                  Forgot password?
                </button>
              </label>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
              >
                Login
              </button>
            </form>
          )}

          {forgotSent ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              OTP sent to your email. (Demo)
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Demo Accounts: <span className="font-semibold text-slate-900">super@walletadmin.com</span> / Secure@123
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Platform overview</div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">One console for secure wallet oversight</h2>
            <p className="mt-2 text-sm text-slate-500">
              Review document pipelines, subscription health, and QR sharing activity with real-time signals.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Active users", value: "128,480", note: "last 30 days" },
              { label: "Revenue", value: "$68.4K", note: "monthly recurring" },
              { label: "Documents", value: "2.4M", note: "securely stored" },
              { label: "Alerts", value: "3,248", note: "expiry window" }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs text-slate-400">{item.label}</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{item.value}</div>
                <div className="text-xs text-slate-500">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>Compliance readiness</span>
              <span>Updated today</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "MFA coverage", value: "92%" },
                { label: "Policy reviews", value: "14 queued" },
                { label: "Audit logs", value: "Realtime" }
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-slate-50 px-3 py-2">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-base font-semibold text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
