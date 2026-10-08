import nodemailer from "nodemailer";
import { site } from "@/lib/siteConfig";

export async function POST(req) {
  try {
    const { name, email, subject, message, website } = await req.json();
    if (website) return Response.json({ ok: true }); // bot caught
    if (!name || !email || !subject || !message || message.length < 10) {
      return Response.json({ error: "Please fill in every field." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const port = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"${site.name} Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || site.email,
      replyTo: email,
      subject: `New message: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "We could not send your message. Please try again." }, { status: 500 });
  }
}
