import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = {
  title: "Shipping Policy | EbsyStore",
  description: "Delivery areas, timelines and shipping charges at EbsyStore.",
};

export default function Shipping() {
  return (
    <LegalPage
      title="Shipping Policy"
      intro="Here is what to expect once you place an order with us."
      sections={[
        {
          title: "Order processing",
          body: [
            "Orders are usually processed within 1 to 3 business days. You will receive an email or message once your order is confirmed and another when it ships, along with tracking details where available.",
          ],
        },
        {
          title: "Delivery times",
          body: [
            "Items stocked locally normally arrive within 3 to 7 business days. Products that ship from partner suppliers overseas can take 10 to 25 business days depending on the item and the courier. The estimate on each product page is our best guess and is not a guarantee.",
          ],
        },
        {
          title: "Shipping charges",
          body: [
            "Orders above Rs. 2,000 qualify for free shipping. For smaller orders, the shipping charge is shown at checkout before you pay, so there are no surprises.",
          ],
        },
        {
          title: "Delays and lost parcels",
          body: [
            "Weather, customs checks and courier issues can cause delays beyond our control. If your parcel has not arrived within the estimated window, contact us and we will chase it with the courier. If a parcel is confirmed lost, we will send a replacement or refund you.",
          ],
        },
        {
          title: "Wrong address",
          body: [
            "Please double check your delivery address. If a parcel is returned because of an incorrect or incomplete address, extra shipping costs may apply to send it again.",
          ],
        },
        {
          title: "Need help?",
          body: [`Write to ${site.email} with your order number and we will look into it.`],
        },
      ]}
    />
  );
}
