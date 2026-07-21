import Stripe from "stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import env from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handelChangeSubscription, handelCheckoutComplte } from "./subscription.utils";

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
      success_url: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ25bZa9p1QYzWD6o3qHFQtqDzKcAFxLfIUeWnTx38qvA&s=10`,
      cancel_url: `https://www.google.com/`,
      metadata: {
        userId: userExist.id,
      },
    });

    return session.url;
  });

  return transectionResult;
};

const handleStripeWebhookServices = async (
  payload: Buffer,
  signature: string,
) => {
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handelCheckoutComplte(event.data.object);

      break;
    case "customer.subscription.updated":
     await handelChangeSubscription(event.data.object);

      break;

    case "customer.subscription.deleted":
      await handelChangeSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No event matched .Unhandled event type ${event.type}.`);
      break;
  }
};


export const subscriptionService = {
  createCheckoutSession,
  handleStripeWebhookServices,
};
