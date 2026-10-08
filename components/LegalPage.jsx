import PageShell from "./PageShell";
import { site } from "@/lib/siteConfig";

export default function LegalPage({ title, intro, sections }) {
  return (
    <PageShell title={title} subtitle={intro}>
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-slate-500">Last updated: {site.updated}</p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-2xl font-medium text-slate-800">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-7 text-slate-600">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>
    </PageShell>
  );
}
