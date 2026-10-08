import LegalPage from "@/components/LegalPage";
import { site } from "@/lib/siteConfig";

export const metadata = {
  title: "Returns and Refunds | EbsyStore",
  description: "How to return an item or request a refund from EbsyStore.",
};

export default function Returns() {
  return (
    <LegalPage
      title="Returns and Refunds"
      intro="If something is not right with your order, we want to fix it."
      sections={[
        {
          title: "Return window",
          body: [
            "You can request a return within 7 days of receiving your order. Items must be unused, in their original packaging and in the same condition you received them.",
          ],
        },
        {
          title: "Damaged, defective or wrong items",
          body: [
            "If your item arrives damaged, does not work or is not what you ordered, contact us within 7 days with clear photos or a short video of the problem and your order number. We will arrange a replacement or a full refund, including the original shipping cost.",
          ],
        },
        {
          title: "Items we cannot take back",
          body: [
            "For hygiene and safety reasons we cannot accept returns on opened earphones, personal care items or products that have been used, washed or altered. Items bought through partner marketplace links follow the return rules of that marketplace.",
          ],
        },
        {
          title: "How to start a return",
          body: [
            `Email ${site.email} with your order number and the reason for the return. We will reply with instructions and a return address. Please do not send anything back before you hear from us.`,
          ],
        },
        {
          title: "Refunds",
          body: [
            "Once we receive and inspect your return, we will notify you of the result. Approved refunds go back to your original payment method within 5 to 10 business days. Return shipping costs are paid by the customer unless the item was faulty or incorrect.",
          ],
        },
      ]}
    />
  );
}
