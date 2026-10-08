import PageShell from "@/components/PageShell";
import PageCTA from "@/components/PageCTA";

export const metadata = {
  title: "About Us | EbsyStore",
  description: "Learn who is behind EbsyStore and how we pick the products we sell.",
};

const values = [
  ["Honest listings", "We describe products the way they really are, with clear photos, real specifications and no exaggerated claims.", "bg-orange-200"],
  ["Fair prices", "Every price is shown in rupees, and shipping costs are visible before you pay, so there are never surprises at checkout.", "bg-blue-200"],
  ["Real support", "When something goes wrong, you talk to a person who wants to fix it, not a script.", "bg-green-200"],
];

const categories = ["Fashion", "Electronics", "Accessories", "Outdoor gear", "Toys", "Watches"];

export default function About() {
  return (
    <PageShell
      badge="OUR STORY"
      note="Gadgets you will love"
      title="About Us"
      subtitle="EbsyStore exists to make good gadgets and everyday accessories easy to find at fair prices."
    >
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-medium text-slate-700">Who we are</h2>
          <p className="mt-5 leading-8 text-slate-600">
            EbsyStore is an independent online store based in Pakistan. We started with a simple idea: shopping for electronics, watches, fashion pieces and outdoor gear should not mean wading through hundreds of near identical listings.
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            We spend our time sorting through products so you do not have to. If something is on our shelves, it is because it looked useful, reasonably priced and well reviewed by real buyers.
          </p>
        </div>
        <div className="rounded-3xl bg-green-100 p-8 md:p-10">
          <h3 className="text-xl font-medium text-slate-800">What you will find here</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((c) => (
              <span key={c} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm">{c}</span>
            ))}
          </div>
          <p className="mt-6 leading-7 text-slate-600">
            We would rather carry fewer products that we feel comfortable recommending than thousands that we cannot vouch for.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {values.map(([t, d, bg]) => (
          <div key={t} className={`rounded-3xl p-8 ${bg}`}>
            <h3 className="text-xl font-medium text-slate-800">{t}</h3>
            <p className="mt-3 leading-7 text-slate-600">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-medium text-slate-700">How we choose products</h2>
          <p className="mt-5 leading-8 text-slate-600">
            We work with trusted suppliers and marketplaces such as AliExpress. Before a product goes live we read buyer reviews, compare specifications across similar items and look at how a supplier handles shipping and after sales support.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-medium text-slate-700">Affiliate relationships</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Some products on EbsyStore link out to partner marketplaces. When you buy through those links we may earn a small commission at no extra cost to you. This helps us keep the site running and never changes the price you pay.
          </p>
        </div>
      </div>

      <PageCTA
        title="Ready to find something you will love?"
        text="Browse the shop and see what we have picked out for you."
        label="Browse the shop"
        href="/shop"
      />
    </PageShell>
  );
}
