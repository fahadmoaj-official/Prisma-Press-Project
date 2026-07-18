import env from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
  const transectionResult = await prisma.$transaction(async (tx) => {
    const userExist = await tx.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!userExist) {
      throw new Error("User not found");
    }

    // old subscriber
    let stripeCustomerId = userExist.subscription?.stripeCustomerId;

    // If the user doesn't have a Stripe customer ID, create a new customer in Stripe
    if (!stripeCustomerId) {
      // new subscriber
      const customer = await stripe.customers.create({
        email: userExist.email,
        name: userExist.name,
        metadata: {
          userId: userExist.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `https://www.google.com/`,
      cancel_url: `https://www.google.com/`,
      metadata: {
        userId: userExist.id,
      },
    });

    return session.url;
  });

  return transectionResult;
};

export const subscriptionService = {
  createCheckoutSession,
};
