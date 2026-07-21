import Stripe from "stripe";
import env from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/client";


export const handelCheckoutComplte = async (session:Stripe.Checkout.Session) =>{

      const userId = session.metadata?.userId;

      const stripeCustomerId= session.customer as string;

      const stripeSubscriptionId = session.subscription as string;



      if(!userId || !stripeCustomerId || !stripeSubscriptionId){
        throw new Error("webhook failed by fm");
      }

      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)


      const currentPeriodStartMillesec  = stripeSubscription.items.data[0]?.current_period_start!;

       const currentPeriodEndMillesec  = stripeSubscription.items.data[0]?.current_period_end!;


       const currentPeriodStart  = new Date(currentPeriodStartMillesec * 1000);
       const currentPeriodEnd = new Date(currentPeriodEndMillesec * 1000);



       await prisma.subscription.upsert({
          where:{
              userId
          },
          create:{
              userId,
              stripeCustomerId,
              stripeSubscriptionId,
              currentPeriodStart,
              currentPeriodEnd
          },
          update:{
              stripeCustomerId,
              stripeSubscriptionId,
              currentPeriodStart,
              currentPeriodEnd
          }
       })

}


export const handelChangeSubscription = async (payload: Stripe.Subscription) => {
  const StripeSubscriptionId = payload.id;

  const subscriptionStatus =
    payload.status === "active"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "trialing"
        ? SubscriptionStatus.ACTIVE
        : payload.status === "canceled"
          ? SubscriptionStatus.CANCELED
          : SubscriptionStatus.EXPIRED;

    const currentPeriodEndMillesec  = payload.items.data[0]?.current_period_end!;
    const currentPeriodEnd  = new Date(currentPeriodEndMillesec * 1000);


  const IsSubscriptionExist = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: StripeSubscriptionId,
    },
  });

  if (!IsSubscriptionExist) {
    console.log("No subcription is Found!");
    return;
  }

  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: StripeSubscriptionId,
    },
    data: {
      status: subscriptionStatus,
      currentPeriodEnd: currentPeriodEnd,
    },
  });
};


// Command: stripe subscription cancel subscription_id