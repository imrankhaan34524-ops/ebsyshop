"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  const field =
    "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100";
  const label = "block text-sm font-medium text-slate-700";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className={label}>Your name<input name="name" required placeholder="Ali Khan" className={field} /></label>
        <label className={label}>Email address<input name="email" type="email" required placeholder="you@example.com" className={field} /></label>
      </div>
      <label className={label}>Subject<input name="subject" required placeholder="Question about my order" className={field} /></label>
      <label className={label}>Message<textarea name="message" rows={6} required minLength={10} placeholder="Tell us how we can help" className={field} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <button
        disabled={status === "sending"}
        className="rounded-xl bg-slate-800 px-9 py-3.5 font-medium text-white transition hover:bg-slate-700 active:scale-95 disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "SEND MESSAGE"}
      </button>
      {status === "sent" && (
        <p className="rounded-2xl bg-green-100 px-5 py-3 text-green-800">Thanks for writing in. We will reply within one business day.</p>
      )}
      {status === "error" && <p className="rounded-2xl bg-red-50 px-5 py-3 text-red-600">{error}</p>}
    </form>
  );
}
