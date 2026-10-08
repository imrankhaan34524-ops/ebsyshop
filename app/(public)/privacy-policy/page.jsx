import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = {
  title: "Privacy Policy | EbsyStore",
  description: "How EbsyStore collects, uses and protects your personal information.",
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your privacy matters to us. This page explains what information we collect, why we collect it and the choices you have."
      sections={[
        {
          title: "Information we collect",
          body: [
            "When you create an account, place an order or contact us, we collect details such as your name, email address, phone number, delivery address and order history. Payment details are handled by our payment partners and are never stored on our own servers.",
            "We also collect basic technical information automatically, including your IP address, browser type, device type, pages visited and the time you spent on them. This helps us understand how the site is used and fix problems quickly.",
          ],
        },
        {
          title: "How we use your information",
          body: [
            "We use your information to process and deliver orders, answer your questions, send order updates, improve our catalogue and keep the site secure. If you subscribe to our emails, we will also send occasional offers, and you can unsubscribe at any time.",
          ],
        },
        {
          title: "Cookies and similar technologies",
          body: [
            "We use cookies to keep you signed in, remember what is in your cart and measure how visitors use the site. You can block or delete cookies in your browser settings, though parts of the store may not work properly without them.",
          ],
        },
        {
          title: "Google AdSense and advertising cookies",
          body: [
            "We use third party advertising partners, including Google, to show ads on our site. Google and its partners use cookies, including the DoubleClick cookie, to serve ads based on your visits to this and other websites.",
            "You can opt out of personalised advertising by visiting Google Ads Settings at https://adssettings.google.com or by visiting https://www.aboutads.info. You can learn more about how Google uses data from partner sites at https://policies.google.com/technologies/partner-sites.",
          ],
        },
        {
          title: "Sharing your information",
          body: [
            "We do not sell your personal information. We share it only with service providers who help us run the store, such as couriers, payment processors, email services and analytics tools, and only to the extent they need it to do their job. We may also disclose information when the law requires it.",
          ],
        },
        {
          title: "Affiliate links",
          body: [
            "Some links on this site lead to partner marketplaces. Those sites have their own privacy practices and we encourage you to read them before sharing personal information there. We are not responsible for how third party sites handle your data.",
          ],
        },
        {
          title: "Data retention and security",
          body: [
            "We keep your information only as long as needed for the purposes described here or as required by law. We use encryption, access controls and secure hosting to protect your data, although no online system can promise perfect security.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You may ask to see, correct or delete the personal information we hold about you. Our store is not directed at children under 13 and we do not knowingly collect their data.",
            `To make a request or ask a question about this policy, write to us at ${site.email}.`,
          ],
        },
        {
          title: "Changes to this policy",
          body: [
            "We may update this policy from time to time. When we do, we will change the date at the top of this page. Continuing to use the site after an update means you accept the revised policy.",
          ],
        },
      ]}
    />
  );
}
