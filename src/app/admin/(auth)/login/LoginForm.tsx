"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace(from.startsWith("/admin") ? from : "/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          placeholder="admin@truelinespectrum.com"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-white/80">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
