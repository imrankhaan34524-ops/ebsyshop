import { prisma } from "@/lib/prisma";

function getPrimaryEmail(user) {
  const emailAddresses = user.email_addresses ?? [];
  const primaryEmail = emailAddresses.find(
    (address) => address.id === user.primary_email_address_id
  );

  return primaryEmail?.email_address ?? emailAddresses[0]?.email_address;
}

export async function syncClerkUser(user) {
  if (!user?.id) {
    throw new Error("Clerk user event is missing its user ID.");
  }

  const email = getPrimaryEmail(user);
  if (!email) {
    throw new Error(`Clerk user ${user.id} has no email address to sync.`);
  }

  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");
  const name = fullName || user.username || "Clerk user";
  const update = {
    email,
    image: user.image_url ?? "",
  };

  if (fullName || user.username) {
    update.name = name;
  }

  return prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      name,
      email,
      image: user.image_url ?? "",
    },
    update,
  });
}

export async function deleteClerkUser(userId) {
  if (!userId) {
    throw new Error("Clerk user deletion event is missing its user ID.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      buyerOrders: { select: { id: true }, take: 1 },
      store: { select: { id: true } },
      Address: {
        where: { Order: { some: {} } },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!user) {
    return;
  }

  if (user.buyerOrders.length || user.store || user.Address.length) {
    await prisma.user.updateMany({
      where: { id: userId },
      data: {
        name: "Deleted user",
        email: `deleted+${userId}@deleted.invalid`,
        image: "",
        cart: {},
      },
    });
    return;
  }

  await prisma.user.deleteMany({ where: { id: userId } });
}