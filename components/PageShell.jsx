import Link from "next/link";

export default function PageShell({ badge = "INFO", note = "EbsyStore help centre", title, subtitle, children }) {
  const words = title.split(" ");
  const last = words.pop();
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-green-200 px-5 py-12 text-center sm:px-10 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/40" />
          <div className="pointer-events-none absolute -bottom-28 -left-10 h-56 w-56 rounded-full bg-green-100/70" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center">
            <nav className="mb-6 text-sm text-slate-500">
              <Link href="/" className="hover:text-green-700">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-slate-700">{title}</span>
            </nav>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-300/50 p-1 pr-4 text-xs text-green-800 sm:text-sm">
              <span className="rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white">{badge}</span>
              {note}
            </span>
            <h1 className="mt-6 text-3xl font-medium leading-tight text-slate-600 sm:text-4xl md:text-5xl lg:text-6xl">
              {words.join(" ")}{words.length ? " " : ""}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#475569,#4ade80)" }}
              >
                {last}.
              </span>
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">{children}</div>
    </main>
  );
}