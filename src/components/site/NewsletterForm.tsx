"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source = "homepage",
  variant = "light",
}: {
  source?: string;
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("done");
        setMessage(data.message || "Thank you for subscribing.");
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  const dark = variant === "dark";

  if (state === "done") {
    return (
      <div
        className={cn(
          "rounded-md px-4 py-3 text-sm font-medium",
          dark ? "bg-white/10 text-white" : "bg-green-50 text-green-700"
        )}
      >
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className={cn(
            "w-full rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green",
            dark
              ? "bg-white/10 text-white placeholder:text-white/50 border border-white/15"
              : "border border-stone-200 text-navy placeholder:text-stone-400"
          )}
        />
        <button type="submit" disabled={state === "loading"} className="btn-primary shrink-0 py-3">
          {state === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {state === "error" && (
        <p className={cn("mt-2 text-sm", dark ? "text-white/80" : "text-stone-500")}>
          {message}
        </p>
      )}
      <p className={cn("mt-2 text-xs", dark ? "text-white/50" : "text-stone-400")}>
        No account needed. Unsubscribe anytime.
      </p>
    </form>
  );
}
