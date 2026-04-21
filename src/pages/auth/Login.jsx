import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider"

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");

  // const passwordValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);

  const passwordValid = password.length >= 8

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!passwordValid) {
      // setError("Password must be 8+ chars with uppercase, number, and symbol.");
      setPassword("Password must be 6+ characters")
      return;
    }
    const result = await login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-slate-900">
      <div className="pointer-events-none absolute -top-24 right-8 h-80 w-80 rounded-full bg-slate-900/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[28rem] w-[28rem] rounded-full bg-slate-900/5 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
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
            <h1 className="text-2xl font-semibold text-slate-900">Sign in to the admin dashboard</h1>
            <p className="text-sm text-slate-500">
              Use your admin credentials to manage users, subscriptions, and platform settings.
            </p>
          </div>

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
            <div className="text-xs text-slate-400">Session is secured with server-side cookies.</div>

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

          {/* <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Demo Accounts: <span className="font-semibold text-slate-900">patrarinita009@gmail.com</span> / 123456
          </div> */}
        </div>
      </div>
    </div>
  );
}
