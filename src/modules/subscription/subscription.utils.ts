import Stripe from "stripe";
import env from "../../config/env";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

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