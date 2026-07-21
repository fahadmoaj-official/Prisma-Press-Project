import { Request, Response} from "express";
import sendResponse from "../../utils/sendResponse";
import { premiumService } from "./premium.service";

const getPremiumContent = async(req:Request, res:Response) => {
    try {

        const queryParams = req.query;
        const result = await premiumService.getPremiumContentIntoDb(queryParams);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Premium content retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
        
    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to get premium content",
            error: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
}


export const premiumController = {
  getPremiumContent,
};