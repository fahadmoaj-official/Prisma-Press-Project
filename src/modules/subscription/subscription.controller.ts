import type { Request, Response,NextFunction } from "express";
import sendResponse from "../../utils/sendResponse";
import { subscriptionService } from "./subscription.service";


const createCheckoutSession = async (req: Request, res: Response) => {
    try {
         const userId = req.user?.id;

         const result = await subscriptionService.createCheckoutSession(userId as string);
         sendResponse(res,{
            statusCode: 200,
            success: true,
            message: 'Checkout session created successfully',
            data: result,
        })
        
    } catch (error) {
        sendResponse(res,{
            statusCode: 500,
            success: false,
            message: 'Failed to create checkout session',
            error: error instanceof Error ? error.message : "Internal Server Error",
        })
    }
}



export const subscriptionController = {
  createCheckoutSession
};