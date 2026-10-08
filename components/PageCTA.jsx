import Link from "next/link";

export default function PageCTA({
  title = "Still have a question?",
  text = "Our team is happy to explain anything in plain words. Send us a message and we will get back to you quickly.",
  label = "Contact Us",
  href = "/contact",
}) {
  return (
    <div
      className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl px-8 py-10 text-white md:flex-row md:items-center md:px-14"
      style={{ backgroundImage: "linear-gradient(100deg,#9b5cf0 0%,#9333c9 45%,#e0794f 100%)" }}
    >
      <div className="max-w-xl">
        <h3 className="text-2xl font-medium md:text-3xl">{title}</h3>
        <p className="mt-2 text-white/85">{text}</p>
      </div>
      <Link href={href} className="rounded-full bg-white px-8 py-3 font-medium text-slate-800 transition hover:scale-105">
        {label}
      </Link>
    </div>
  );
}
