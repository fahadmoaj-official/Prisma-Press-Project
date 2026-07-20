import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { subscriptionService } from "./subscription.service";

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(
      userId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to create checkout session",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    await subscriptionService.handleStripeWebhook(event, signature);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Webhook received successfully",
      data: null
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Failed to handle Stripe webhook",
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const subscriptionController = {
  createCheckoutSession,
  handleStripeWebhook,
};
