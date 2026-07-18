import type{ Request, Response, NextFunction } from 'express';
import sendResponse from '../utils/sendResponse';
import httpStatus from 'http-status';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
     sendResponse(res,{
        statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: err.message || 'Something went wrong!',
        error: err.stack,
        
     }) 

}
// is not working , i will fix it later