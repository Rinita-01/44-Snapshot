import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090f] text-slate-100">
      <div className="pointer-events-none absolute -top-40 left-10 h-96 w-96 rounded-full bg-emerald-500/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 right-10 h-[30rem] w-[30rem] rounded-full bg-indigo-500/30 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/95 p-1 shadow-[0_10px_30px_rgba(16,185,129,0.35)]">
              <img src="/logo.png" alt="44 Snapshot" className="h-full w-full rounded-xl object-contain" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-wide">44 Snapshot</div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Admin Console</div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Guarded access to your most sensitive wallet operations.
            </h1>
            <p className="max-w-lg text-sm text-slate-300">
              Centralize audits, approve high-risk flows, and supervise user activity with RBAC and encrypted session control.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Realtime Alerts", value: "Instant" },
              { label: "Sessions", value: "JWT + MFA" },
              { label: "Compliance", value: "SOC-ready" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-base font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-emerald-200/80">
              <span>Security Pulse</span>
              <span>Last 24h</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Approvals", value: "128" },
                { label: "Flags", value: "3" },
                { label: "Latency", value: "0.7s" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-black/20 px-3 py-2">
                  <div className="text-xs text-slate-400">{item.label}</div>
                  <div className="text-lg font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-slate-300">Welcome back</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Sign in</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-emerald-200/80">
              Verified Console
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="text-sm text-slate-200">
              Email
              <input
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@securewallet.com"
                required
              />
            </label>
            <label className="text-sm text-slate-200">
              Password
              <input
                className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
              <span className={passwordValid ? "text-xs text-emerald-300" : "text-xs text-amber-300"}>
                Password must include uppercase, number, symbol.
              </span>
            </label>
            <label className="flex items-center justify-between text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <input
                  className="h-4 w-4 rounded border-white/20 bg-black/30 text-emerald-400 focus:ring-emerald-400/60"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </span>
              <button
                type="button"
                className="text-sm text-emerald-200 hover:text-emerald-100"
                onClick={() => setForgotSent(true)}
              >
                Forgot password?
              </button>
            </label>

            {error ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/20 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_rgba(45,212,191,0.35)] transition hover:translate-y-[-1px]"
            >
              Login
            </button>
          </form>

          {forgotSent ? (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-3 py-2 text-xs text-emerald-100">
              Reset link sent to your email. (Demo)
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-slate-300">
            Demo Accounts: <span className="font-semibold text-white">super@walletadmin.com</span> / Secure@123
          </div>
        </div>
      </div>
    </div>
  );
}
