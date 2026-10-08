import PageShell from "@/components/PageShell";
import ContactForm from "./ContactForm";
import { site } from "@/lib/siteConfig";

export const metadata = {
  title: "Contact Us | EbsyStore",
  description: "Questions about an order, a product or a return? Get in touch with the EbsyStore support team.",
};

const icon = (d) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const faqs = [
  ["How fast will you reply?", "We answer every message within one business day, and usually much sooner during working hours."],
  ["Where is my order?", "Send us your order number through the form and we will check the status with the courier and tell you exactly where your parcel is."],
  ["How do I start a return?", "Write to us within 7 days of delivery with your order number and a few photos of the item. We will guide you through the next steps."],
  ["Can I change my address after ordering?", "Yes, as long as the order has not shipped yet. Contact us as soon as possible and we will update it for you."],
];

export default function ContactPage() {
  const cards = [
    ["Email us", site.email, "We reply within one business day", "bg-green-200", "text-green-700",
      icon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>)],
    ["Call us", site.phone, site.hours, "bg-orange-200", "text-orange-600",
      icon(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />)],
    ["Visit us", site.address, "Visits by appointment only", "bg-blue-200", "text-blue-700",
      icon(<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>)],
  ];

  return (
    <PageShell
      badge="HELP"
      note="We are here to help"
      title="Contact Us"
      subtitle="Have a question about an order, a product or a return? Send us a note and a real person will get back to you."
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          {cards.map(([label, value, note, bg, fg, svg]) => (
            <div key={label} className={`flex gap-5 rounded-3xl p-6 ${bg}`}>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 ${fg}`}>{svg}</div>
              <div>
                <p className="text-sm text-slate-600">{label}</p>
                <p className="mt-0.5 text-lg font-medium text-slate-800">{value}</p>
                <p className="mt-1 text-sm text-slate-600">{note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm md:p-10 lg:col-span-3">
          <h2 className="text-2xl font-medium text-slate-800">Send us a message</h2>
          <p className="mb-7 mt-1 text-slate-500">Fill in the form and we will take it from there.</p>
          <ContactForm />
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl font-medium text-slate-700">
          Quick{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#475569,#4ade80)" }}>
            answers.
          </span>
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-3xl bg-slate-50 p-6 open:bg-green-100">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-800">
                {q}
                <span className="ml-4 text-2xl text-green-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-7 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
