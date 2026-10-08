import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = {
  title: "Terms of Service | EbsyStore",
  description: "The rules that apply when you browse or buy from EbsyStore.",
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="By visiting or buying from EbsyStore you agree to the terms below. Please read them carefully."
      sections={[
        {
          title: "Using the site",
          body: [
            "You agree to use EbsyStore only for lawful purposes and in a way that does not harm the site or other visitors. You must be at least 18 years old, or have permission from a parent or guardian, to place an order.",
          ],
        },
        {
          title: "Accounts",
          body: [
            "You are responsible for keeping your login details safe and for everything that happens under your account. Tell us right away if you suspect unauthorised use.",
          ],
        },
        {
          title: "Products and pricing",
          body: [
            "We try hard to keep descriptions, images and prices accurate, but mistakes can happen. Colours may look slightly different on your screen. If we discover a pricing or listing error, we may cancel the order and refund you in full.",
            "Prices are shown in Pakistani rupees unless stated otherwise and may change without notice.",
          ],
        },
        {
          title: "Orders and payment",
          body: [
            "Placing an order is an offer to buy. We may accept or decline it, for example if an item is out of stock or we cannot verify your details. An order is confirmed only when you receive a confirmation message from us.",
          ],
        },
        {
          title: "Shipping and returns",
          body: [
            "Delivery times and return rules are explained in our Shipping Policy and our Returns and Refunds page. Both form part of these terms.",
          ],
        },
        {
          title: "Affiliate links and third party sites",
          body: [
            "Some products link to partner marketplaces, and we may earn a commission on purchases made there. Once you leave our site, the terms and policies of that partner apply, and we are not responsible for their content or service.",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            "The text, design, logos and layout of EbsyStore belong to us or our licensors. You may not copy, reproduce or republish them without written permission. Product names and images may belong to their respective brand owners.",
          ],
        },
        {
          title: "Limitation of liability",
          body: [
            "To the fullest extent allowed by law, EbsyStore is not liable for indirect or consequential losses arising from your use of the site or from products purchased through it. Our total liability for any claim will not exceed the amount you paid for the product involved.",
          ],
        },
        {
          title: "Governing law",
          body: [
            "These terms are governed by the laws of Pakistan. Any dispute will be handled by the courts of Pakistan.",
          ],
        },
        {
          title: "Contact",
          body: [`Questions about these terms can be sent to ${site.email}.`],
        },
      ]}
    />
  );
}
