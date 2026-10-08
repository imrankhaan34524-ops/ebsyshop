import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Disclaimer | EbsyStore",
  description: "Important notes about product information, affiliate links and advertising on EbsyStore.",
};

export default function Disclaimer() {
  return (
    <LegalPage
      title="Disclaimer"
      intro="A few honest notes about how this website works."
      sections={[
        {
          title: "Affiliate disclosure",
          body: [
            "EbsyStore participates in affiliate programs, including those of online marketplaces. If you click a link and make a purchase, we may receive a commission at no additional cost to you. We only feature products we believe are worth considering.",
          ],
        },
        {
          title: "Product information",
          body: [
            "We do our best to keep descriptions, specifications and images accurate, but manufacturers can change details without telling us. Always check the final listing before you buy.",
          ],
        },
        {
          title: "Advertising",
          body: [
            "This site may show ads from third party networks such as Google AdSense. We do not control the content of those ads and an ad is not an endorsement from us.",
          ],
        },
        {
          title: "External links",
          body: [
            "Our pages may link to other websites. We are not responsible for their content, accuracy or privacy practices.",
          ],
        },
        {
          title: "No professional advice",
          body: [
            "Any guidance on this site is general information about products and is not professional, medical or legal advice. Use products according to the maker's instructions.",
          ],
        },
      ]}
    />
  );
}
