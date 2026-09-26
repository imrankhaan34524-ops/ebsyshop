import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { deleteClerkUser, syncClerkUser } from "@/lib/clerk-user-sync";

export async function POST(request) {
  let event;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await syncClerkUser(event.data);
        break;
      case "user.deleted":
        await deleteClerkUser(event.data.id);
        break;
      default:
        return Response.json({ received: true, ignored: true });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error(`Clerk ${event.type} webhook processing failed:`, error);
    return Response.json({ error: "Unable to process Clerk webhook." }, { status: 500 });
  }
}